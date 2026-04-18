import { Injectable, Logger } from '@nestjs/common';
import { streamText, embed, CoreMessage, StreamTextResult } from 'ai';
import { AiProviderFactory, AiProviderConfig } from './ai-provider.factory';
import { AiConfigService } from './ai-config.service';
import { PrismaService } from '../prisma/prisma.service';

export interface AiChatOptions {
  conversationId: string;
  messages: CoreMessage[];
  systemPrompt: string;
  tools?: Record<string, any>;
  maxTokens?: number;
  temperature?: number;
  onFinish?: (result: { text: string; usage: { totalTokens: number } }) => void;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly providerFactory: AiProviderFactory,
    private readonly aiConfigService: AiConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get the AI agent configuration from the database.
   */
  async getConfig() {
    return this.prisma.aiAgentConfig.findFirst();
  }

  /**
   * Check if the AI agent is enabled and properly configured.
   */
  async isEnabled(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config?.enabled) return false;

    const provider = await this.providerFactory.getActiveProvider();
    return !!provider;
  }

  /**
   * Stream a chat response from the AI model.
   */
  async streamChat(options: AiChatOptions): Promise<StreamTextResult<any, any>> {
    const providerConfig = await this.providerFactory.getActiveProvider();
    if (!providerConfig) {
      throw new Error('No active AI provider configured');
    }

    // Minimal log for stream start
    this.logger.debug(`streamChat using provider ${providerConfig.providerType}`);

    const model = this.providerFactory.createLanguageModel(providerConfig);

    const result = streamText({
      model,
      system: options.systemPrompt,
      messages: options.messages,
      tools: options.tools,
      maxTokens: options.maxTokens,
      temperature: options.temperature,
      maxSteps: 3, // Allow up to 3 tool call rounds
      onFinish: options.onFinish ? (event) => {
        options.onFinish!({
          text: event.text,
          usage: { totalTokens: event.usage?.totalTokens ?? 0 },
        });
      } : undefined,
    });

    return result;
  }

  /**
   * Generate embeddings for a text input.
   * Uses the dedicated embedding provider if configured, otherwise falls back to the active chat provider.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const providerConfig = await this.aiConfigService.getEmbeddingProvider();
    if (!providerConfig) {
      throw new Error('No AI provider configured for embeddings. Please configure an embedding provider in AI Agent Setup.');
    }

    const embeddingModel = this.providerFactory.createEmbeddingModel(providerConfig);
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });

    return embedding;
  }

  /**
   * Generate embeddings for multiple text inputs in batch.
   * Uses the dedicated embedding provider if configured, otherwise falls back to the active chat provider.
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const { embedMany } = await import('ai');
    const providerConfig = await this.aiConfigService.getEmbeddingProvider();
    if (!providerConfig) {
      throw new Error('No AI provider configured for embeddings. Please configure an embedding provider in AI Agent Setup.');
    }

    const embeddingModel = this.providerFactory.createEmbeddingModel(providerConfig);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: texts,
    });

    return embeddings;
  }
}
