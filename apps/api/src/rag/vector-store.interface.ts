/**
 * VectorStoreProvider — abstraction for vector similarity search.
 * Implementations exist for MongoDB (Atlas Vector Search),
 * PostgreSQL (pgvector), and MySQL (native VECTOR type).
 */
export interface VectorStoreProvider {
  /**
   * Store document chunks with their embeddings.
   */
  upsertEmbeddings(chunks: VectorChunk[]): Promise<void>;

  /**
   * Search for similar chunks given a query embedding.
   */
  similaritySearch(queryEmbedding: number[], topK: number): Promise<VectorSearchResult[]>;

  /**
   * Delete all chunks for a given document.
   */
  deleteByDocumentId(documentId: string): Promise<void>;
}

export interface VectorChunk {
  id?: string;
  documentId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
  metadata?: string;
}

export interface VectorSearchResult {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  score: number;
  metadata?: string;
}

export const VECTOR_STORE_PROVIDER = 'VECTOR_STORE_PROVIDER';
