import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

// Cast helper — MySQL/PG vector stores use raw queries not available
// in the MongoDB-generated Prisma client typings, but are present at runtime
// when the active schema targets MySQL/PostgreSQL.
type PrismaRaw = PrismaService & {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: any[]) => Promise<T>;
  $executeRawUnsafe: (query: string, ...values: any[]) => Promise<number>;
};

/**
 * MySQL Vector Store implementation.
 * For MySQL 9.0+: uses native VECTOR type and vector distance functions.
 * For MySQL 8.x: falls back to JSON storage with application-level cosine similarity.
 *
 * Requires adding an embedding column via raw SQL:
 * MySQL 9.0+: ALTER TABLE DocumentChunk ADD COLUMN embedding VECTOR(1536);
 * MySQL 8.x:  ALTER TABLE DocumentChunk ADD COLUMN embedding JSON;
 */
@Injectable()
export class MySQLVectorStore implements VectorStoreProvider {
  private readonly logger = new Logger(MySQLVectorStore.name);
  private supportsNativeVector: boolean | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private get raw(): PrismaRaw {
    return this.prisma as PrismaRaw;
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
    const nativeVector = await this.checkNativeVectorSupport();

    for (const chunk of chunks) {
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
        // MySQL 8.x fallback: store as JSON
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
    }
    this.logger.log(`Stored ${chunks.length} chunks for document ${chunks[0]?.documentId}`);
  }

  async similaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
    const nativeVector = await this.checkNativeVectorSupport();
    const embeddingJson = JSON.stringify(queryEmbedding);

    if (nativeVector) {
      // MySQL 9.0+ native vector distance
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

      return results.map((row: any) => ({
        id: row.id,
        documentId: row.documentId,
        content: row.content,
        chunkIndex: row.chunkIndex,
        score: parseFloat(row.score),
        metadata: row.metadata,
      }));
    }

    // MySQL 8.x fallback: fetch all and compute cosine similarity in JS
    this.logger.warn('Using application-level cosine similarity (MySQL < 9.0)');
    const allChunks = await this.raw.$queryRawUnsafe<any[]>(
      `SELECT id, documentId, content, chunkIndex, metadata, embedding
       FROM DocumentChunk
       WHERE embedding IS NOT NULL`,
    );

    const scored = allChunks.map((row: any) => {
      const stored = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding;
      const score = this.cosineSimilarity(queryEmbedding, stored);
      return { ...row, score };
    });

    scored.sort((a: any, b: any) => b.score - a.score);

    return scored.slice(0, topK).map((row: any) => ({
      id: row.id,
      documentId: row.documentId,
      content: row.content,
      chunkIndex: row.chunkIndex,
      score: row.score,
      metadata: row.metadata,
    }));
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
