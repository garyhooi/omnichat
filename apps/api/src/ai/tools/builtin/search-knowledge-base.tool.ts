import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';
import { RagService } from '../../../rag/rag.service';

export class SearchKnowledgeBaseTool implements ToolHandler {
  name = 'search_knowledge_base';
  description = 'Search the knowledge base for information relevant to the customer\'s question. Use this when you need to find answers to customer inquiries about products, services, policies, or FAQs.';
  parameters = z.object({
    query: z.string().describe('The search query to find relevant information'),
    topK: z.number().optional().default(3).describe('Number of results to return (default: 3)'),
  });

  constructor(private readonly ragService: RagService) {}

  async execute(args: { query: string; topK?: number }, context: ToolContext): Promise<any> {
    const results = await this.ragService.searchKnowledgeBase(args.query, args.topK || 3);

    if (results.length === 0) {
      return {
        found: false,
        message: 'No relevant information found in the knowledge base.',
        results: [],
      };
    }

    return {
      found: true,
      results: results.map((r) => ({
        content: r.content,
        score: r.score,
      })),
    };
  }
}
