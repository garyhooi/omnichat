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

// ---------------------------------------------------------------------------
// Provider metadata — single source of truth for defaults
// ---------------------------------------------------------------------------
interface ProviderMeta {
  defaultBaseUrl?: string;          // Required for non-OpenAI providers
  defaultEmbeddingModel?: string;   // null = provider doesn't support embeddings
  supportsEmbeddings: boolean;
  supportsImages: boolean;
  sdk: 'openai-compat' | 'anthropic' | 'ollama';
}

const PROVIDER_META: Record<string, ProviderMeta> = {
  openai: {
    sdk: 'openai-compat',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'text-embedding-3-small',
  },
  openrouter: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'openai/text-embedding-3-small',
  },
  anthropic: {
    sdk: 'anthropic',
    supportsEmbeddings: false,
    supportsImages: true,
  },
  ollama: {
    sdk: 'ollama',
    defaultBaseUrl: 'http://localhost:11434/api',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'nomic-embed-text',
  },
  deepseek: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    supportsEmbeddings: false,
    supportsImages: true,
  },
  qwen: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'text-embedding-v3',
  },
  glm: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'embedding-3',
  },
  gemini: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    supportsEmbeddings: true,
    supportsImages: true,
    defaultEmbeddingModel: 'text-embedding-004',
  },
  grok: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://api.x.ai/v1',
    supportsEmbeddings: false,
    supportsImages: true,
  },
  mimo: {
    sdk: 'openai-compat',
    defaultBaseUrl: 'https://api.mimo.ai/v1',
    supportsEmbeddings: false,
    supportsImages: false,
  },
};

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

  /** Resolve the base URL: user override > provider default > undefined (SDK default). */
  private resolveBaseUrl(config: AiProviderConfig): string | undefined {
    const meta = PROVIDER_META[config.providerType];
    return config.baseUrl || meta?.defaultBaseUrl || undefined;
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
    const meta = PROVIDER_META[config.providerType];
    if (!meta) {
      throw new Error(`Unsupported provider type: ${config.providerType}`);
    }

    const baseURL = this.resolveBaseUrl(config);

    switch (meta.sdk) {
      case 'anthropic': {
        const anthropic = createAnthropic({
          apiKey: config.apiKey || undefined,
          baseURL,
        });
        return anthropic(config.chatModelId);
      }
      case 'ollama': {
        const ollama = createOllama({ baseURL: baseURL! });
        return ollama(config.chatModelId);
      }
      case 'openai-compat':
      default: {
        const openai = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL,
        });
        return openai(config.chatModelId);
      }
    }
  }

  /**
   * Create an embedding model from the provider config.
   * Uses provider-specific default embedding models when none is configured.
   * Throws a clear error for providers that don't support embeddings.
   */
  createEmbeddingModel(config: AiProviderConfig): EmbeddingModel<string> {
    const meta = PROVIDER_META[config.providerType];
    if (!meta) {
      throw new Error(`Unsupported provider type for embeddings: ${config.providerType}`);
    }

    if (!meta.supportsEmbeddings) {
      throw new Error(
        `${config.providerType} does not support embeddings. ` +
        `Please select an embedding provider that supports embeddings (OpenAI, OpenRouter, Ollama, Gemini, Qwen) in AI Agent Setup.`,
      );
    }

    const embeddingId = config.embeddingModelId || meta.defaultEmbeddingModel!;
    const baseURL = this.resolveBaseUrl(config);

    switch (meta.sdk) {
      case 'ollama': {
        const ollama = createOllama({ baseURL: baseURL! });
        return ollama.embedding(embeddingId);
      }
      case 'openai-compat':
      default: {
        const openai = createOpenAI({
          apiKey: config.apiKey || undefined,
          baseURL,
        });
        return openai.embedding(embeddingId);
      }
    }
  }

  /**
   * Check if a provider supports image (multi-modal) inputs.
   */
  supportsImages(config: AiProviderConfig): boolean {
    const meta = PROVIDER_META[config.providerType];
    if (!meta) return false;
    return meta.supportsImages;
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
