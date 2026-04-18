import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreProvider, VectorChunk, VectorSearchResult } from './vector-store.interface';

type PrismaRaw = PrismaService & {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: any[]) => Promise<T>;
  $executeRawUnsafe: (query: string, ...values: any[]) => Promise<number>;
};

/**
 * PostgreSQL pgvector implementation.
 * Requires the pgvector extension: CREATE EXTENSION IF NOT EXISTS vector;
 * The embedding column is of type vector(1536).
 */
@Injectable()
export class PostgreSQLVectorStore implements VectorStoreProvider {
  private readonly logger = new Logger(PostgreSQLVectorStore.name);

  constructor(private readonly prisma: PrismaService) {}

  private get raw(): PrismaRaw {
    return this.prisma as PrismaRaw;
  }

  async upsertEmbeddings(chunks: VectorChunk[]): Promise<void> {
    for (const chunk of chunks) {
      const embeddingStr = `[${chunk.embedding.join(',')}]`;
      await this.raw.$executeRawUnsafe(
        `INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "chunkIndex", metadata, "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3::vector, $4, $5, NOW())`,
        chunk.documentId,
        chunk.content,
        embeddingStr,
        chunk.chunkIndex,
        chunk.metadata || null,
      );
    }
    this.logger.log(`Stored ${chunks.length} chunks for document ${chunks[0]?.documentId}`);
  }

  async similaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]> {
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

    return results.map((row: any) => ({
      id: row.id,
      documentId: row.documentId,
      content: row.content,
      chunkIndex: row.chunkIndex,
      score: parseFloat(row.score),
      metadata: row.metadata,
    }));
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({
      where: { documentId },
    });
    this.logger.log(`Deleted chunks for document ${documentId}`);
  }
}
