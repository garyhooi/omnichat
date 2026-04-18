import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

type PrismaRaw = PrismaService & {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: any[]) => Promise<T>;
  $executeRawUnsafe: (query: string, ...values: any[]) => Promise<number>;
};

/**
 * PostgreSQL pgvector implementation.
 * Auto-creates the pgvector extension and embedding column on startup.
 * Falls back to in-memory cosine similarity if pgvector is not available.
 */
@Injectable()
export class PostgreSQLVectorStore implements VectorStoreProvider, OnModuleInit {
  private readonly logger = new Logger(PostgreSQLVectorStore.name);
  private pgvectorReady = false;

  constructor(private readonly prisma: PrismaService) {}

  private get raw(): PrismaRaw {
    return this.prisma as PrismaRaw;
  }

  async onModuleInit() {
    await this.ensurePgvector();
  }

  /**
   * Attempt to enable pgvector extension and ensure the embedding column
   * has the correct vector type. Non-fatal if it fails (e.g. extension not installed).
   */
  private async ensurePgvector(): Promise<void> {
    try {
      await this.raw.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector');
      this.logger.log('pgvector extension is available');

      // Check if embedding column exists and has vector type
      const cols = await this.raw.$queryRawUnsafe<any[]>(
        `SELECT data_type FROM information_schema.columns
         WHERE table_name = 'DocumentChunk' AND column_name = 'embedding'`,
      );

      if (cols.length === 0) {
        // Column doesn't exist yet — add it
        this.logger.log('Adding embedding vector column to DocumentChunk...');
        await this.raw.$executeRawUnsafe(
          `ALTER TABLE "DocumentChunk" ADD COLUMN IF NOT EXISTS embedding vector(1536)`,
        );
      } else if (cols[0]?.data_type === 'USER-DEFINED') {
        // Already a vector column — good
        this.logger.log('Embedding column already has vector type');
      } else {
        // Column exists but is not vector type — might be text/json from migration
        this.logger.warn(
          `Embedding column type is "${cols[0]?.data_type}", not vector. ` +
          `Consider running: ALTER TABLE "DocumentChunk" ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector;`,
        );
      }

      this.pgvectorReady = true;
    } catch (error: any) {
      this.logger.warn(
        `pgvector is not available: ${error.message}. ` +
        `Vector search will use in-memory cosine similarity fallback. ` +
        `To enable pgvector, install the extension: CREATE EXTENSION vector;`,
      );
      this.pgvectorReady = false;
    }
  }

  async upsertEmbeddings(chunks: VectorChunk[]): Promise<void> {
    if (chunks.length === 0) return;

    for (const chunk of chunks) {
      try {
        const embeddingStr = `[${chunk.embedding.join(',')}]`;

        if (this.pgvectorReady) {
          await this.raw.$executeRawUnsafe(
            `INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "chunkIndex", metadata, "createdAt")
             VALUES (gen_random_uuid()::text, $1, $2, $3::vector, $4, $5, NOW())`,
            chunk.documentId,
            chunk.content,
            embeddingStr,
            chunk.chunkIndex,
            chunk.metadata || null,
          );
        } else {
          // Fallback: store embedding as JSON text
          await this.raw.$executeRawUnsafe(
            `INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "chunkIndex", metadata, "createdAt")
             VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())`,
            chunk.documentId,
            chunk.content,
            JSON.stringify(chunk.embedding),
            chunk.chunkIndex,
            chunk.metadata || null,
          );
        }
      } catch (error: any) {
        this.logger.error(`Failed to upsert chunk ${chunk.chunkIndex} for document ${chunk.documentId}: ${error.message}`);
        throw error;
      }
    }
    this.logger.log(`Stored ${chunks.length} chunks for document ${chunks[0]?.documentId}`);
  }

  async similaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    if (this.pgvectorReady) {
      try {
        const embeddingStr = `[${queryEmbedding.join(',')}]`;

        const results = await this.raw.$queryRawUnsafe<any[]>(
          `SELECT id, "documentId", content, "chunkIndex", metadata,
                  1 - (embedding <=> $1::vector) AS score
           FROM "DocumentChunk"
           WHERE embedding IS NOT NULL
           ORDER BY embedding <=> $1::vector
           LIMIT $2`,
          embeddingStr,
          topK,
        );

        if (results.length > 0) {
          this.logger.debug(`pgvector search returned ${results.length} results (top score: ${parseFloat(results[0].score).toFixed(4)})`);
          return results.map((row: any) => ({
            id: row.id,
            documentId: row.documentId,
            content: row.content,
            chunkIndex: row.chunkIndex,
            score: parseFloat(row.score),
            metadata: row.metadata,
          }));
        }

        this.logger.debug('pgvector search returned 0 results, trying fallback...');
      } catch (error: any) {
        this.logger.warn(`pgvector search failed: ${error.message}. Falling back to in-memory cosine similarity.`);
        this.pgvectorReady = false;
      }
    }

    return this.fallbackCosineSimilaritySearch(queryEmbedding, topK);
  }

  /**
   * Fallback: fetch all chunks and compute cosine similarity in memory.
   * Used when pgvector extension is unavailable.
   */
  private async fallbackCosineSimilaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    try {
      const allChunks = await this.raw.$queryRawUnsafe<any[]>(
        `SELECT id, "documentId", content, "chunkIndex", metadata, embedding
         FROM "DocumentChunk"
         WHERE embedding IS NOT NULL`,
      );

      this.logger.log(`Fallback search: found ${allChunks.length} total chunks in DB`);
      if (allChunks.length === 0) return [];

      const scored = allChunks
        .map((row: any) => {
          let stored: number[];
          try {
            stored = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding;
          } catch {
            return null;
          }
          if (!stored || !Array.isArray(stored) || stored.length === 0) return null;
          return {
            id: row.id,
            documentId: row.documentId,
            content: row.content,
            chunkIndex: row.chunkIndex,
            metadata: row.metadata,
            score: this.cosineSimilarity(queryEmbedding, stored),
          };
        })
        .filter(Boolean) as VectorSearchResult[];

      if (scored.length === 0) {
        this.logger.warn('All chunks have empty or unparseable embeddings — documents may need to be re-uploaded');
        return [];
      }

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
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({
      where: { documentId },
    });
    this.logger.log(`Deleted chunks for document ${documentId}`);
  }
}
