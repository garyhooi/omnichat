import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOllama } from 'ollama-ai-provider';
import { LanguageModelV1, EmbeddingModel } from 'ai';
import { createDecipheriv, scryptSync } from 'crypto';

export interface AiProviderConfig {
  id: string;
  name: string;
  providerType: string;
  apiKey: string | null;
  baseUrl: string | null;
  chatModelId: string;
  embeddingModelId: string | null;
}

@Injectable()
export class AiProviderFactory {
  private readonly logger = new Logger(AiProviderFactory.name);
  private readonly encryptionKey: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const secret = this.config.get<string>('JWT_SECRET', 'omnichat-default-key');
    this.encryptionKey = scryptSync(secret, 'omnichat-ai-salt', 32);
  }

  private decryptApiKey(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Fetch the active AI provider configuration from the database.
   * Decrypts the API key before returning.
   */
  async getActiveProvider(): Promise<AiProviderConfig | null> {
    const provider = await this.prisma.aiProvider.findFirst({
      where: { isActive: true },
    });
    if (provider?.apiKey) {
      try {
        provider.apiKey = this.decryptApiKey(provider.apiKey);
      } catch {
        // Key may not be encrypted (legacy), use as-is
        this.logger.warn('Failed to decrypt API key, using raw value');
      }
    }
    return provider;
  }

  /**
   * Create a Vercel AI SDK language model from the provider config.
   */
  createLanguageModel(config: AiProviderConfig): LanguageModelV1 {
    switch (config.providerType) {
      case 'openai': {
        const openai = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL: config.baseUrl || undefined,
        });
        return openai(config.chatModelId);
      }
      case 'anthropic': {
        const anthropic = createAnthropic({
          apiKey: config.apiKey || undefined,
          baseURL: config.baseUrl || undefined,
        });
        return anthropic(config.chatModelId);
      }
      case 'openrouter': {
        const openrouter = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL: config.baseUrl || 'https://openrouter.ai/api/v1',
        });
        return openrouter(config.chatModelId);
      }
      case 'ollama': {
        const ollama = createOllama({
          baseURL: config.baseUrl || 'http://localhost:11434/api',
        });
        return ollama(config.chatModelId);
      }
      default:
        throw new Error(`Unsupported provider type: ${config.providerType}`);
    }
  }

  /**
   * Create an embedding model from the provider config.
   * Falls back to OpenAI text-embedding-3-small if no embedding model specified.
   */
  createEmbeddingModel(config: AiProviderConfig): EmbeddingModel<string> {
    const embeddingId = config.embeddingModelId || 'text-embedding-3-small';

    switch (config.providerType) {
      case 'openai':
      case 'openrouter': {
        const openai = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL: config.providerType === 'openrouter'
            ? undefined  // Use default OpenAI URL for embeddings even with OpenRouter
            : (config.baseUrl || undefined),
        });
        return openai.embedding(embeddingId);
      }
      case 'anthropic': {
        // Anthropic doesn't provide embeddings; fall back to OpenAI if API key available
        this.logger.warn('Anthropic does not support embeddings. Configure an OpenAI API key or use a different provider for embeddings.');
        throw new Error('Anthropic does not support embeddings. Use OpenAI or another provider for embedding generation.');
      }
      case 'qwen':
      case 'glm':
      case 'deepseek':
      case 'gemini':
      case 'grok':
      case 'mimo': {
        const other = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL: config.baseUrl || undefined,
        });
        return other.embedding(embeddingId);
      }
      case 'ollama': {
        const ollama = createOllama({
          baseURL: config.baseUrl || 'http://localhost:11434/api',
        });
        return ollama.embedding(embeddingId);
      }
      default:
        throw new Error(`Unsupported provider type for embeddings: ${config.providerType}`);
    }
  }

  /**
   * Test the connection to the AI provider.
   */
  async testConnection(config: AiProviderConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const { generateText } = await import('ai');
      const model = this.createLanguageModel(config);
      await generateText({
        model,
        prompt: 'Say "OK" and nothing else.',
        maxTokens: 5,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
