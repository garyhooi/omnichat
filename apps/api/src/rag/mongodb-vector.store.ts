import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

/**
 * MongoDB Atlas Vector Search implementation.
 * Requires an Atlas Vector Search index named "vector_index" on the
 * DocumentChunk collection with the "embedding" field.
 *
 * Index definition (create via Atlas UI or API):
 * {
 *   "fields": [{
 *     "type": "vector",
 *     "path": "embedding",
 *     "numDimensions": 1536,
 *     "similarity": "cosine"
 *   }]
 * }
 */
@Injectable()
export class MongoDBVectorStore implements VectorStoreProvider {
  private readonly logger = new Logger(MongoDBVectorStore.name);

  constructor(private readonly prisma: PrismaService) {}

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
    // Use MongoDB $vectorSearch aggregation via raw command
    const dbName = (this.prisma as any)._engineConfig?.datasources?.db?.url
      ? new URL((this.prisma as any)._engineConfig.datasources.db.url).pathname.slice(1)
      : 'omnichat';

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
      return docs.map((doc: any) => ({
        id: doc._id.toString(),
        documentId: doc.documentId,
        content: doc.content,
        chunkIndex: doc.chunkIndex,
        score: doc.score,
        metadata: doc.metadata,
      }));
    } catch (error: any) {
      this.logger.error(`Vector search failed: ${error.message}`);
      // Fallback: return empty results if index doesn't exist yet
      if (error.message?.includes('index') || error.message?.includes('vectorSearch')) {
        this.logger.warn('Atlas Vector Search index may not be configured. Returning empty results.');
        return [];
      }
      throw error;
    }
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({
      where: { documentId },
    });
    this.logger.log(`Deleted chunks for document ${documentId}`);
  }
}
