import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiProviderFactory } from './ai-provider.factory';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiConfigService {
  private readonly logger = new Logger(AiConfigService.name);
  private readonly encryptionKey: Buffer;
  private readonly defaultHumanRequestKeywords = [
    'human',
    'real person',
    'real agent',
    'live agent',
    'live chat',
    'speak to someone',
    'talk to someone',
    'representative',
    'operator',
    'support agent',
    'customer service',
    'actual person',
    'not a bot',
    'not a robot',
    'stop bot',
    'real human',
    'connect me to',
    'transfer me to',
    'let me talk to',
  ].join(', ');

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactory,
    private readonly config: ConfigService,
  ) {
    // Derive encryption key from JWT_SECRET (reuse existing secret)
    const secret = this.config.get<string>('JWT_SECRET', 'omnichat-default-key');
    this.encryptionKey = scryptSync(secret, 'omnichat-ai-salt', 32);
  }

  // =========================================================================
  // API Key Encryption
  // =========================================================================

  private encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // =========================================================================
  // AI Provider CRUD
  // =========================================================================

  async getProviders() {
    const providers = await this.prisma.aiProvider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Mask API keys in response
    return providers.map((p) => ({
      ...p,
      apiKey: p.apiKey ? '••••••••' : null,
    }));
  }

  async getActiveProvider() {
    const provider = await this.prisma.aiProvider.findFirst({
      where: { isActive: true },
    });
    if (provider?.apiKey) {
      try {
        provider.apiKey = this.decrypt(provider.apiKey);
      } catch {
        // Key may not be encrypted (legacy), use as-is
      }
    }
    return provider;
  }

  async createProvider(data: {
    name: string;
    providerType: string;
    apiKey?: string;
    baseUrl?: string;
    chatModelId: string;
    embeddingModelId?: string;
  }) {
    const encrypted = data.apiKey ? this.encrypt(data.apiKey) : null;
    return this.prisma.aiProvider.create({
      data: {
        name: data.name,
        providerType: data.providerType,
        apiKey: encrypted,
        baseUrl: data.baseUrl || null,
        chatModelId: data.chatModelId,
        embeddingModelId: data.embeddingModelId || null,
        isActive: false,
      },
    });
  }

  async updateProvider(id: string, data: {
    name?: string;
    providerType?: string;
    apiKey?: string;
    baseUrl?: string;
    chatModelId?: string;
    embeddingModelId?: string;
    isActive?: boolean;
  }) {
    const updateData: any = { ...data };

    if (data.apiKey) {
      updateData.apiKey = this.encrypt(data.apiKey);
    }

    // If activating this provider, deactivate all others
    if (data.isActive) {
      await this.prisma.aiProvider.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.aiProvider.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteProvider(id: string) {
    return this.prisma.aiProvider.delete({ where: { id } });
  }

  async testProviderConnection(id: string) {
    const provider = await this.prisma.aiProvider.findUnique({ where: { id } });
    if (!provider) throw new Error('Provider not found');

    // Decrypt API key for testing
    const config = {
      ...provider,
      apiKey: provider.apiKey ? this.decrypt(provider.apiKey) : null,
    };

    return this.providerFactory.testConnection(config);
  }

  // =========================================================================
  // AI Agent Config CRUD
  // =========================================================================

  async getAgentConfig() {
    return this.prisma.aiAgentConfig.findFirst();
  }

  async upsertAgentConfig(data: {
    enabled?: boolean;
    systemPrompt?: string;
    greetingMessage?: string;
    humanRequestKeywords?: string;
    maxTokensPerResponse?: number;
    temperature?: number;
    maxTurnsPerConversation?: number;
    maxTokensPerSession?: number;
    ragFailureThreshold?: number;
    humanRequestThreshold?: number;
    aiRateLimitPerMinute?: number;
    embeddingProviderId?: string | null;
  }) {
    const existing = await this.prisma.aiAgentConfig.findFirst();

    if (existing) {
      return this.prisma.aiAgentConfig.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.aiAgentConfig.create({
      data: {
        enabled: data.enabled ?? false,
        systemPrompt: data.systemPrompt ?? 'You are a helpful customer support assistant. Be concise and helpful.',
        greetingMessage: data.greetingMessage ?? null,
        humanRequestKeywords: data.humanRequestKeywords ?? this.defaultHumanRequestKeywords,
        maxTokensPerResponse: data.maxTokensPerResponse ?? 1024,
        temperature: data.temperature ?? 0.7,
        maxTurnsPerConversation: data.maxTurnsPerConversation ?? 50,
        maxTokensPerSession: data.maxTokensPerSession ?? 50000,
        ragFailureThreshold: data.ragFailureThreshold ?? 2,
        humanRequestThreshold: data.humanRequestThreshold ?? 2,
        aiRateLimitPerMinute: data.aiRateLimitPerMinute ?? 10,
      },
    });
  }

  // =========================================================================
  // Embedding Provider
  // =========================================================================

  /**
   * Get the provider to use for embeddings.
   * If an embeddingProviderId is configured in AiAgentConfig, use that provider.
   * Otherwise, fall back to the active chat provider.
   */
  async getEmbeddingProvider() {
    const agentConfig = await this.prisma.aiAgentConfig.findFirst();
    if (agentConfig?.embeddingProviderId) {
      const provider = await this.prisma.aiProvider.findUnique({
        where: { id: agentConfig.embeddingProviderId },
      });
      if (provider?.apiKey) {
        try {
          provider.apiKey = this.decrypt(provider.apiKey);
        } catch {
          // Key may not be encrypted (legacy), use as-is
        }
      }
      if (provider) return provider;
      this.logger.warn(`Embedding provider ${agentConfig.embeddingProviderId} not found, falling back to active provider`);
    }
    return this.getActiveProvider();
  }
}
