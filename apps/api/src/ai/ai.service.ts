import { Injectable, Logger } from '@nestjs/common';
import { streamText, embed, embedMany, CoreMessage } from 'ai';
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
  abortSignal?: AbortSignal;
  onFinish?: (result: {
    text: string;
    usage: { promptTokens?: number; completionTokens?: number; totalTokens: number };
    /** Provider that actually served this response (differs after failover). */
    provider?: AiProviderConfig | null;
  }) => void;
  /** Called when a failing primary is skipped in favour of the next provider. */
  onFailover?: (info: {
    from: { id: string; name: string };
    to: { id: string; name: string };
    error: string;
  }) => void;
}

/**
 * Failover-aware streaming result. `fullStream` yields the parts of the first
 * provider attempt that produces output — attempts that fail before emitting
 * anything are retried on the next provider of the chain transparently.
 */
export interface AiStreamResult {
  fullStream: AsyncIterable<any>;
  /** Tool results of the winning attempt (empty when none/no tools ran). */
  toolResults: Promise<any>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly providerFactory: AiProviderFactory,
    private readonly aiConfigService: AiConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Get the AI agent configuration. */
  async getConfig() {
    return this.prisma.aiAgentConfig.findFirst();
  }

  /** Check if AI agent is enabled and configured. */
  async isEnabled(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config?.enabled) return false;

    const provider = await this.providerFactory.getActiveProvider();
    return !!provider;
  }

  /**
   * Run one AI call across an ordered provider chain. The chain is tried in
   * order; on any error the next provider takes over automatically. Resolves
   * with both the result and the provider that produced it.
   */
  async executeWithFailover<T>(
    chain: AiProviderConfig[],
    label: string,
    run: (provider: AiProviderConfig) => Promise<T>,
  ): Promise<{ result: T; provider: AiProviderConfig }> {
    if (!chain || chain.length === 0) {
      throw new Error(`No AI provider configured for ${label}`);
    }
    let lastError: unknown;
    for (let i = 0; i < chain.length; i++) {
      const provider = chain[i];
      try {
        const result = await run(provider);
        if (i > 0) {
          this.logger.warn(`${label}: recovered on failover provider "${provider.name}" (${provider.providerType})`);
        }
        return { result, provider };
      } catch (err: any) {
        lastError = err;
        const isLast = i === chain.length - 1;
        this.logger.error(
          `${label}: provider "${provider.name}" (${provider.providerType}) failed` +
            `${isLast ? '' : ` — failing over to "${chain[i + 1].name}"`} : ${err.message}`,
        );
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  /**
   * Stream a chat response with automatic provider failover.
   *
   * Providers are tried in order (active provider first, then the configured
   * chat failover provider). A failing attempt is only retried while NOTHING
   * has been streamed to the visitor yet — once text deltas were emitted a
   * restart would duplicate output, so late errors are surfaced as-is.
   */
  async streamChat(options: AiChatOptions): Promise<AiStreamResult> {
    const chain = await this.aiConfigService.getChatProviderChain();
    if (!chain.length) {
      throw new Error('No active AI provider configured');
    }
    const toolCount = options.tools ? Object.keys(options.tools).length : 0;

    let resolveTools!: (value: any) => void;
    const toolResults = new Promise<any>((resolve) => {
      resolveTools = resolve;
    });
    let toolsResolved = false;
    const settleTools = (value: any) => {
      if (!toolsResolved) {
        toolsResolved = true;
        resolveTools(value ?? []);
      }
    };

    const self = this;
    // Set once an attempt starts producing output — its toolResults promise is
    // then awaited asynchronously and must NOT be short-circuited by the guard.
    let winnerPending = false;
    async function* iterate(): AsyncGenerator<any> {
      try {
        for (let i = 0; i < chain.length; i++) {
          const provider = chain[i];
          const isLast = i === chain.length - 1;
          // True once this attempt emitted anything — failover is only allowed before that.
          let emitted = false;
          try {
            self.logger.log(
              `streamChat using provider "${provider.name}" (${provider.providerType})${i > 0 ? ' [failover]' : ''} | tools=${toolCount} | toolNames=${options.tools ? Object.keys(options.tools).join(',') : 'none'}`,
            );
            const model = self.providerFactory.createLanguageModel(provider);
            const result = streamText({
              model,
              system: options.systemPrompt,
              messages: options.messages,
              tools: options.tools,
              maxTokens: options.maxTokens,
              temperature: options.temperature,
              abortSignal: options.abortSignal,
              maxSteps: 3, // Allow up to 3 tool call rounds
              onFinish: options.onFinish ? (event) => {
                // Attempts that failed before emitting never reach the visitor —
                // their finish events must not trigger usage recording/handoffs.
                if (!emitted) return;
                options.onFinish!({
                  text: event.text,
                  usage: {
                    promptTokens: event.usage?.promptTokens,
                    completionTokens: event.usage?.completionTokens,
                    totalTokens: event.usage?.totalTokens ?? 0,
                  },
                  provider,
                });
              } : undefined,
            });

            for await (const part of result.fullStream) {
              if (options.abortSignal?.aborted) return;
              if (part.type === 'error') {
                const rawError = part.error as any;
                const msg = rawError?.message ?? String(rawError ?? 'unknown stream error');
                self.logger.error(
                  `streamChat: provider "${provider.name}" (${provider.providerType}) stream error: ${msg}`,
                );
                settleTools([]);
                if (!emitted && !isLast) {
                  options.onFailover?.({
                    from: { id: provider.id, name: provider.name },
                    to: { id: chain[i + 1].id, name: chain[i + 1].name },
                    error: String(msg),
                  });
                  break; // nothing emitted yet → fail over
                }
                yield part;
                return;
              }
              if (!emitted && (part.type === 'text-delta' || part.type === 'tool-call' || part.type === 'tool-result')) {
                emitted = true;
                winnerPending = true;
                result.toolResults.then(settleTools).catch(() => settleTools([]));
              }
              yield part;
            }
            // Completed normally — expose this attempt's tool results.
            result.toolResults.then(settleTools).catch(() => settleTools([]));
            return;
          } catch (err: any) {
            if (options.abortSignal?.aborted) return;
            const willFailover = !emitted && !isLast;
            self.logger.error(
              `streamChat: provider "${provider.name}" (${provider.providerType}) failed` +
                `${willFailover ? ` — failing over to "${chain[i + 1].name}"` : ''}: ${err.message}`,
            );
            if (willFailover) {
              options.onFailover?.({
                from: { id: provider.id, name: provider.name },
                to: { id: chain[i + 1].id, name: chain[i + 1].name },
                error: err.message ?? String(err),
              });
              continue; // fail over
            }
            throw err;
          }
        }
      } finally {
        // Guarantee consumers awaiting toolResults always settle (abort/break
        // paths). A no-op when a winning attempt's results already settled it
        // or are pending via the listener above.
        if (!winnerPending) settleTools([]);
      }
    }

    return { fullStream: iterate(), toolResults };
  }

  /**
   * Persist one AI call's token usage for the reports. Snapshots the serving
   * provider's pricing so historical reports stay accurate after price edits.
   * Pass `providerOverride` (from the stream's onFinish) so usage made via a
   * failover provider is attributed and priced correctly.
   */
  async recordUsage(
    conversationId: string,
    usage: { promptTokens?: number; completionTokens?: number; totalTokens: number },
    providerOverride?: AiProviderConfig | null,
  ): Promise<void> {
    try {
      let promptTokens = usage.promptTokens ?? 0;
      let completionTokens = usage.completionTokens ?? 0;
      if (!usage.promptTokens && !usage.completionTokens) {
        // Provider only reported a total — treat it as input-side usage
        // (a conservative estimate until the provider reports a split).
        promptTokens = usage.totalTokens;
      }
      const totalTokens = usage.totalTokens || promptTokens + completionTokens;

      const provider = providerOverride ?? (await this.providerFactory.getActiveProvider());
      const inputPricePerM = provider?.inputPricePerM ?? 0;
      const outputPricePerM = provider?.outputPricePerM ?? 0;
      const cost =
        (promptTokens / 1_000_000) * inputPricePerM +
        (completionTokens / 1_000_000) * outputPricePerM;

      await this.prisma.tokenUsage.create({
        data: {
          conversationId,
          providerId: provider?.id ?? null,
          providerName: provider?.name ?? null,
          modelId: provider?.chatModelId ?? null,
          promptTokens,
          completionTokens,
          totalTokens,
          inputPricePerM,
          outputPricePerM,
          cost,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed to record token usage for ${conversationId}: ${err.message}`);
    }
  }

  /** Check if active provider supports image inputs. */
  async supportsImages(): Promise<boolean> {
    const providerConfig = await this.providerFactory.getActiveProvider();
    if (!providerConfig) return false;
    return this.providerFactory.supportsImages(providerConfig);
  }

  /** Generate embeddings for a text input — fails over to the backup provider on errors. */
  async generateEmbedding(text: string): Promise<number[]> {
    const chain = await this.aiConfigService.getEmbeddingProviderChain();
    if (!chain.length) {
      throw new Error('No AI provider configured for embeddings. Please configure an embedding provider in AI Agent Setup.');
    }
    const { result } = await this.executeWithFailover(chain, 'Embedding', async (providerConfig) => {
      const embeddingModel = this.providerFactory.createEmbeddingModel(providerConfig);
      const { embedding } = await embed({
        model: embeddingModel,
        value: text,
      });
      return embedding;
    });
    return result;
  }

  /** Generate embeddings for multiple text inputs in batch — with provider failover. */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const chain = await this.aiConfigService.getEmbeddingProviderChain();
    if (!chain.length) {
      throw new Error('No AI provider configured for embeddings. Please configure an embedding provider in AI Agent Setup.');
    }
    const { result } = await this.executeWithFailover(chain, 'Embedding batch', async (providerConfig) => {
      const embeddingModel = this.providerFactory.createEmbeddingModel(providerConfig);
      const { embeddings } = await embedMany({
        model: embeddingModel,
        values: texts,
      });
      return embeddings;
    });
    return result;
  }
}
