import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

/**
 * MongoDB Atlas Vector Search implementation.
 * Automatically creates the required vector search index on startup
 * if it doesn't already exist.
 */
@Injectable()
export class MongoDBVectorStore implements VectorStoreProvider, OnModuleInit {
  private readonly logger = new Logger(MongoDBVectorStore.name);
  private indexReady = false;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureVectorIndex();
  }

  /**
   * Check if the Atlas Vector Search index exists; create it if missing.
   * Uses the Atlas `createSearchIndexes` command (Atlas M10+ clusters, MongoDB 6.0+).
   */
  private async ensureVectorIndex(): Promise<void> {
    try {
      // List existing search indexes on the DocumentChunk collection
      const listResult: any = await (this.prisma as any).$runCommandRaw({
        listSearchIndexes: 'DocumentChunk',
      });

      const indexes = listResult?.cursor?.firstBatch || [];
      const hasVectorIndex = indexes.some((idx: any) => idx.name === 'vector_index');

      if (hasVectorIndex) {
        this.logger.log('Atlas Vector Search index "vector_index" already exists');
        this.indexReady = true;
        return;
      }

      this.logger.log('Creating Atlas Vector Search index "vector_index"...');

      await (this.prisma as any).$runCommandRaw({
        createSearchIndexes: 'DocumentChunk',
        indexes: [
          {
            name: 'vector_index',
            type: 'vectorSearch',
            definition: {
              fields: [
                {
                  type: 'vector',
                  path: 'embedding',
                  numDimensions: 1536,
                  similarity: 'cosine',
                },
              ],
            },
          },
        ],
      });

      this.logger.log('Atlas Vector Search index "vector_index" created successfully. It may take a few minutes to become active.');
      this.indexReady = true;
    } catch (error: any) {
      // Non-fatal: might be on a free-tier or local MongoDB that doesn't support search indexes
      this.logger.warn(
        `Could not auto-create Atlas Vector Search index: ${error.message}. ` +
        `If you are using MongoDB Atlas (M10+), please create the index manually via the Atlas UI. ` +
        `If you are using local MongoDB, vector search requires Atlas or a manual cosine-similarity fallback.`
      );
    }
  }

  async upsertEmbeddings(chunks: VectorChunk[]): Promise<void> {
    for (const chunk of chunks) {
      await this.prisma.documentChunk.create({
        data: {
          documentId: chunk.documentId,
          content: chunk.content,
          embedding: chunk.embedding,
          chunkIndex: chunk.chunkIndex,
          metadata: chunk.metadata || null,
        },
      });
    }
    this.logger.log(`Stored ${chunks.length} chunks for document ${chunks[0]?.documentId}`);
  }

  async similaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    // Skip Atlas $vectorSearch if we already know the index isn't available
    if (this.indexReady) {
      try {
        const results: any = await (this.prisma as any).$runCommandRaw({
          aggregate: 'DocumentChunk',
          pipeline: [
            {
              $vectorSearch: {
                index: 'vector_index',
                path: 'embedding',
                queryVector: queryEmbedding,
                numCandidates: topK * 10,
                limit: topK,
              },
            },
            {
              $project: {
                _id: 1,
                documentId: 1,
                content: 1,
                chunkIndex: 1,
                metadata: 1,
                score: { $meta: 'vectorSearchScore' },
              },
            },
          ],
          cursor: {},
        });

        const docs = results?.cursor?.firstBatch || [];
        if (docs.length > 0) {
          return docs.map((doc: any) => ({
            id: doc._id.toString(),
            documentId: doc.documentId,
            content: doc.content,
            chunkIndex: doc.chunkIndex,
            score: doc.score,
            metadata: doc.metadata,
          }));
        }
        // If Atlas returned 0 results, also try fallback (index might still be building)
        this.logger.debug('Atlas Vector Search returned 0 results, trying fallback...');
      } catch (error: any) {
        this.logger.warn(`Atlas Vector Search failed: ${error.message}. Falling back to in-memory cosine similarity.`);
        this.indexReady = false; // Don't retry Atlas on subsequent calls
      }
    }

    return this.fallbackCosineSimilaritySearch(queryEmbedding, topK);
  }

  /**
   * Fallback: fetch all chunks and compute cosine similarity in memory.
   * Used when Atlas Vector Search index is unavailable (free-tier, local MongoDB,
   * or index still building).
   */
  private async fallbackCosineSimilaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    try {
      const allChunks = await this.prisma.documentChunk.findMany({
        select: {
          id: true,
          documentId: true,
          content: true,
          chunkIndex: true,
          metadata: true,
          embedding: true,
        },
      });

      this.logger.log(`Fallback search: found ${allChunks.length} total chunks in DB`);

      if (allChunks.length === 0) return [];

      // Verify embeddings are present
      const chunksWithEmbeddings = allChunks.filter((c) => c.embedding && c.embedding.length > 0);
      if (chunksWithEmbeddings.length === 0) {
        this.logger.warn('All chunks have empty embeddings — documents may need to be re-uploaded');
        return [];
      }
      if (chunksWithEmbeddings.length !== allChunks.length) {
        this.logger.warn(`${allChunks.length - chunksWithEmbeddings.length} chunks have no embeddings`);
      }

      // Compute cosine similarity for each chunk
      const scored = chunksWithEmbeddings.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        metadata: chunk.metadata ?? undefined,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      }));

      // Sort by score descending and return top-K
      scored.sort((a, b) => b.score - a.score);
      const results = scored.slice(0, topK);
      this.logger.log(`Fallback search: returning ${results.length} results (top score: ${results[0]?.score?.toFixed(4) ?? 'n/a'})`);
      return results;
    } catch (error: any) {
      this.logger.error(`Fallback cosine similarity search failed: ${error.message}`);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({
      where: { documentId },
    });
    this.logger.log(`Deleted chunks for document ${documentId}`);
  }
}
