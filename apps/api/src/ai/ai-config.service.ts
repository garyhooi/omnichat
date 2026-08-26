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

  async getProviders() {
    const providers = await this.prisma.aiProvider.findMany({
      orderBy: { createdAt: 'desc' },
    });
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

  /**
   * Reject API keys that are the masked placeholder (the admin UI masks saved
   * keys as "••••••••"). If such a value is stored, it decrypts back to the
   * bullet character which undici rejects when building the provider's HTTP
   * Authorization header ("Cannot convert argument to a ByteString ..."). Fail
   * the save so a masked value can never become the active provider's key.
   */
  private validateApiKey(apiKey?: string): void {
    if (!apiKey) return;
    if (apiKey.includes('\u2022') || /^\u2022+$/.test(apiKey)) {
      throw new Error(
        'API key is masked/placeholder ("••••••••"). Enter the real provider API key.',
      );
    }
  }

  async createProvider(data: {
    name: string;
    providerType: string;
    apiKey?: string;
    baseUrl?: string;
    chatModelId: string;
    embeddingModelId?: string;
    inputPricePerM?: number;
    outputPricePerM?: number;
    maxTokensPerDay?: number | null;
    maxTokensPerWeek?: number | null;
    maxTokensPerMonth?: number | null;
    maxTokensPerQuarter?: number | null;
    maxTokensPerHalfYear?: number | null;
    maxTokensPerYear?: number | null;
  }) {
    this.validateApiKey(data.apiKey);
    const encrypted = data.apiKey ? this.encrypt(data.apiKey) : null;
    return this.prisma.aiProvider.create({
      data: {
        name: data.name,
        providerType: data.providerType,
        apiKey: encrypted,
        baseUrl: data.baseUrl || null,
        chatModelId: data.chatModelId,
        embeddingModelId: data.embeddingModelId || null,
        inputPricePerM: data.inputPricePerM ?? 0,
        outputPricePerM: data.outputPricePerM ?? 0,
        maxTokensPerDay: data.maxTokensPerDay ?? null,
        maxTokensPerWeek: data.maxTokensPerWeek ?? null,
        maxTokensPerMonth: data.maxTokensPerMonth ?? null,
        maxTokensPerQuarter: data.maxTokensPerQuarter ?? null,
        maxTokensPerHalfYear: data.maxTokensPerHalfYear ?? null,
        maxTokensPerYear: data.maxTokensPerYear ?? null,
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
    inputPricePerM?: number;
    outputPricePerM?: number;
    maxTokensPerDay?: number | null;
    maxTokensPerWeek?: number | null;
    maxTokensPerMonth?: number | null;
    maxTokensPerQuarter?: number | null;
    maxTokensPerHalfYear?: number | null;
    maxTokensPerYear?: number | null;
  }) {
    const updateData: any = { ...data };

    if (data.apiKey) {
      this.validateApiKey(data.apiKey);
      updateData.apiKey = this.encrypt(data.apiKey);
    }

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

    const config = {
      ...provider,
      apiKey: provider.apiKey ? this.decrypt(provider.apiKey) : null,
    };

    return this.providerFactory.testConnection(config);
  }

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
    spamIpBlacklistMinutes?: number;
    embeddingProviderId?: string | null;
    translateProviderId?: string | null;
    chatFailoverProviderId?: string | null;
    embeddingFailoverProviderId?: string | null;
    translateFailoverProviderId?: string | null;
    translationEnabled?: boolean;
    autoTranslationEnabled?: boolean;
    maxTokensPerDay?: number | null;
    maxTokensPerWeek?: number | null;
    maxTokensPerMonth?: number | null;
    maxTokensPerQuarter?: number | null;
    maxTokensPerHalfYear?: number | null;
    maxTokensPerYear?: number | null;
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
        spamIpBlacklistMinutes: data.spamIpBlacklistMinutes ?? 15,
        maxTokensPerDay: data.maxTokensPerDay ?? null,
        maxTokensPerWeek: data.maxTokensPerWeek ?? null,
        maxTokensPerMonth: data.maxTokensPerMonth ?? null,
        maxTokensPerQuarter: data.maxTokensPerQuarter ?? null,
        maxTokensPerHalfYear: data.maxTokensPerHalfYear ?? null,
        maxTokensPerYear: data.maxTokensPerYear ?? null,
      },
    });
  }

  async getTools() {
    return this.prisma.toolRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTool(data: {
    name: string;
    description: string;
    parametersSchema: Record<string, any>;
    handlerType?: string;
    endpoint?: string;
    authType?: string;
    authConfig?: Record<string, any>;
    isActive?: boolean;
  }) {
    return this.prisma.toolRegistration.create({
      data: {
        name: data.name,
        description: data.description,
        parametersSchema: JSON.stringify(data.parametersSchema),
        handlerType: data.handlerType ?? 'external',
        endpoint: data.endpoint || null,
        authType: data.authType || null,
        authConfig: data.authConfig ? JSON.stringify(data.authConfig) : null,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateTool(id: string, data: {
    name?: string;
    description?: string;
    parametersSchema?: Record<string, any>;
    handlerType?: string;
    endpoint?: string;
    authType?: string;
    authConfig?: Record<string, any>;
    isActive?: boolean;
  }) {
    const updateData: any = { ...data };
    if (data.parametersSchema) {
      updateData.parametersSchema = JSON.stringify(data.parametersSchema);
    }
    if (data.authConfig) {
      updateData.authConfig = JSON.stringify(data.authConfig);
    }
    return this.prisma.toolRegistration.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTool(id: string) {
    return this.prisma.toolRegistration.delete({ where: { id } });
  }

  /** Load one provider by id with its API key decrypted (null when missing). */
  private async loadProvider(id?: string | null) {
    if (!id) return null;
    const provider = await this.prisma.aiProvider.findUnique({ where: { id } });
    if (!provider) {
      this.logger.warn(`AI provider ${id} not found — skipping it in the failover chain`);
      return null;
    }
    if (provider.apiKey) {
      try {
        provider.apiKey = this.decrypt(provider.apiKey);
      } catch {
        // Key may not be encrypted (legacy), use as-is
      }
    }
    return provider;
  }

  /**
   * Build an ordered failover chain: [primary, ...backups]. Duplicates and
   * missing providers are dropped so callers can simply try the entries in
   * order until one succeeds.
   */
  private buildChain(
    primary: Awaited<ReturnType<AiConfigService['loadProvider']>>,
    failovers: Array<Awaited<ReturnType<AiConfigService['loadProvider']>>>,
  ) {
    const chain: NonNullable<Awaited<ReturnType<AiConfigService['loadProvider']>>>[] = [];
    for (const p of [primary, ...failovers]) {
      if (!p) continue;
      if (chain.some((c) => c.id === p.id)) continue;
      chain.push(p);
    }
    return chain;
  }

  /**
   * Ordered chat providers: the active provider first, then the configured
   * chat failover provider. The AI agent tries them in order on errors.
   */
  async getChatProviderChain() {
    const agentConfig = await this.prisma.aiAgentConfig.findFirst();
    const primary = await this.getActiveProvider();
    const backup = await this.loadProvider(agentConfig?.chatFailoverProviderId);
    return this.buildChain(primary, [backup]);
  }

  /** Get embedding provider — falls back to active chat provider if not configured. */
  async getEmbeddingProvider() {
    const chain = await this.getEmbeddingProviderChain();
    return chain[0] ?? null;
  }

  /**
   * Ordered embedding providers: the configured embedding provider (or the
   * active chat provider), then the configured embedding failover provider.
   * Note: the backup should produce vectors with the same dimensions as the
   * primary, otherwise similarity search over mixed embeddings degrades.
   */
  async getEmbeddingProviderChain() {
    const agentConfig = await this.prisma.aiAgentConfig.findFirst();
    let primary = agentConfig?.embeddingProviderId
      ? await this.loadProvider(agentConfig.embeddingProviderId)
      : null;
    if (!primary && agentConfig?.embeddingProviderId) {
      this.logger.warn(`Embedding provider ${agentConfig.embeddingProviderId} not found, falling back to active provider`);
    }
    primary = primary ?? (await this.getActiveProvider());
    const backup = await this.loadProvider(agentConfig?.embeddingFailoverProviderId);
    return this.buildChain(primary, [backup]);
  }

  /** Get translation provider — falls back to active chat provider if not configured. */
  async getTranslationProvider() {
    const chain = await this.getTranslationProviderChain();
    return chain[0] ?? null;
  }

  /**
   * Ordered translation providers: the configured translation provider (or the
   * active chat provider), then the configured translation failover provider.
   */
  async getTranslationProviderChain() {
    const agentConfig = await this.prisma.aiAgentConfig.findFirst();
    let primary = agentConfig?.translateProviderId
      ? await this.loadProvider(agentConfig.translateProviderId)
      : null;
    if (!primary && agentConfig?.translateProviderId) {
      this.logger.warn(`Translation provider ${agentConfig.translateProviderId} not found, falling back to active provider`);
    }
    primary = primary ?? (await this.getActiveProvider());
    const backup = await this.loadProvider(agentConfig?.translateFailoverProviderId);
    return this.buildChain(primary, [backup]);
  }
}
