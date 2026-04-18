import { Inject, Injectable, Logger } from '@nestjs/common';
import { VECTOR_STORE_PROVIDER, VectorStoreProvider, VectorSearchResult } from './vector-store.interface';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    @Inject(VECTOR_STORE_PROVIDER)
    private readonly vectorStore: VectorStoreProvider,
    private readonly aiService: AiService,
  ) {}

  /**
   * Search the knowledge base for content relevant to the query.
   * Returns top-K matching chunks with similarity scores.
   */
  async searchKnowledgeBase(query: string, topK: number = 5): Promise<VectorSearchResult[]> {
    try {
      const queryEmbedding = await this.aiService.generateEmbedding(query);
      this.logger.log(`Generated query embedding (${queryEmbedding.length} dimensions) for "${query.slice(0, 50)}..."`);

      const results = await this.vectorStore.similaritySearch(queryEmbedding, topK);
      this.logger.log(`Knowledge base search returned ${results.length} results`);
      return results;
    } catch (error: any) {
      this.logger.error(`Knowledge base search failed: ${error.message}`);
      return [];
    }
  }
}
