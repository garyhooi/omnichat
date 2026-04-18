import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

type PrismaRaw = PrismaService & {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: any[]) => Promise<T>;
  $executeRawUnsafe: (query: string, ...values: any[]) => Promise<number>;
};

/**
 * MySQL Vector Store implementation.
 * Auto-detects MySQL version on startup:
 * - MySQL 9.0+: uses native VECTOR type and vector distance functions.
 * - MySQL 8.x: falls back to JSON storage with application-level cosine similarity.
 *
 * Auto-creates the embedding column if missing.
 */
@Injectable()
export class MySQLVectorStore implements VectorStoreProvider, OnModuleInit {
  private readonly logger = new Logger(MySQLVectorStore.name);
  private supportsNativeVector: boolean | null = null;
  private embeddingColumnReady = false;

  constructor(private readonly prisma: PrismaService) {}

  private get raw(): PrismaRaw {
    return this.prisma as PrismaRaw;
  }

  async onModuleInit() {
    await this.ensureSetup();
  }

  /**
   * Detect MySQL version, check/create embedding column.
   */
  private async ensureSetup(): Promise<void> {
    // 1. Check MySQL version
    await this.checkNativeVectorSupport();

    // 2. Check/create embedding column
    try {
      const cols = await this.raw.$queryRawUnsafe<any[]>(
        `SELECT DATA_TYPE, COLUMN_TYPE FROM information_schema.COLUMNS
         WHERE TABLE_NAME = 'DocumentChunk' AND COLUMN_NAME = 'embedding'
         AND TABLE_SCHEMA = DATABASE()`,
      );

      if (cols.length === 0) {
        // Column doesn't exist — add it
        if (this.supportsNativeVector) {
          this.logger.log('Adding embedding VECTOR(1536) column to DocumentChunk...');
          await this.raw.$executeRawUnsafe(
            `ALTER TABLE DocumentChunk ADD COLUMN embedding VECTOR(1536)`,
          );
        } else {
          this.logger.log('Adding embedding JSON column to DocumentChunk...');
          await this.raw.$executeRawUnsafe(
            `ALTER TABLE DocumentChunk ADD COLUMN embedding JSON`,
          );
        }
      } else {
        this.logger.log(`Embedding column exists (type: ${cols[0]?.COLUMN_TYPE || cols[0]?.DATA_TYPE})`);
      }

      this.embeddingColumnReady = true;
    } catch (error: any) {
      this.logger.warn(`Could not verify/create embedding column: ${error.message}. Will attempt operations anyway.`);
      this.embeddingColumnReady = true; // try anyway
    }
  }

  /**
   * Detect if MySQL supports native VECTOR type (9.0+).
   */
  private async checkNativeVectorSupport(): Promise<boolean> {
    if (this.supportsNativeVector !== null) return this.supportsNativeVector;

    try {
      const result = await this.raw.$queryRawUnsafe<any[]>('SELECT VERSION() as version');
      const version = result[0]?.version || '';
      const major = parseInt(version.split('.')[0], 10);
      this.supportsNativeVector = major >= 9;
      this.logger.log(`MySQL version: ${version}, native vector support: ${this.supportsNativeVector}`);
    } catch {
      this.supportsNativeVector = false;
    }
    return this.supportsNativeVector;
  }

  async upsertEmbeddings(chunks: VectorChunk[]): Promise<void> {
    if (chunks.length === 0) return;
    const nativeVector = await this.checkNativeVectorSupport();

    for (const chunk of chunks) {
      try {
        const embeddingJson = JSON.stringify(chunk.embedding);

        if (nativeVector) {
          await this.raw.$executeRawUnsafe(
            `INSERT INTO DocumentChunk (id, documentId, content, embedding, chunkIndex, metadata, createdAt)
             VALUES (UUID(), ?, ?, STRING_TO_VECTOR(?), ?, ?, NOW())`,
            chunk.documentId,
            chunk.content,
            embeddingJson,
            chunk.chunkIndex,
            chunk.metadata || null,
          );
        } else {
          await this.raw.$executeRawUnsafe(
            `INSERT INTO DocumentChunk (id, documentId, content, embedding, chunkIndex, metadata, createdAt)
             VALUES (UUID(), ?, ?, ?, ?, ?, NOW())`,
            chunk.documentId,
            chunk.content,
            embeddingJson,
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
    const nativeVector = await this.checkNativeVectorSupport();
    const embeddingJson = JSON.stringify(queryEmbedding);

    if (nativeVector) {
      try {
        const results = await this.raw.$queryRawUnsafe<any[]>(
          `SELECT id, documentId, content, chunkIndex, metadata,
                  (1 - DISTANCE(embedding, STRING_TO_VECTOR(?), 'COSINE')) AS score
           FROM DocumentChunk
           WHERE embedding IS NOT NULL
           ORDER BY DISTANCE(embedding, STRING_TO_VECTOR(?), 'COSINE')
           LIMIT ?`,
          embeddingJson,
          embeddingJson,
          topK,
        );

        if (results.length > 0) {
          this.logger.debug(`Native vector search returned ${results.length} results (top score: ${parseFloat(results[0].score).toFixed(4)})`);
          return results.map((row: any) => ({
            id: row.id,
            documentId: row.documentId,
            content: row.content,
            chunkIndex: row.chunkIndex,
            score: parseFloat(row.score),
            metadata: row.metadata,
          }));
        }

        this.logger.debug('Native vector search returned 0 results, trying fallback...');
      } catch (error: any) {
        this.logger.warn(`Native vector search failed: ${error.message}. Falling back to in-memory cosine similarity.`);
        this.supportsNativeVector = false; // Don't retry native on subsequent calls
      }
    }

    return this.fallbackCosineSimilaritySearch(queryEmbedding, topK);
  }

  /**
   * Fallback: fetch all chunks and compute cosine similarity in memory.
   * Used for MySQL 8.x or when native vector search fails.
   */
  private async fallbackCosineSimilaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    try {
      this.logger.debug('Using application-level cosine similarity fallback');
      const allChunks = await this.raw.$queryRawUnsafe<any[]>(
        `SELECT id, documentId, content, chunkIndex, metadata, embedding
         FROM DocumentChunk
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
