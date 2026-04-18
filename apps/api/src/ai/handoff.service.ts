import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SESSION_STATE_STORE, SessionStateStore } from '../session-state/session-state.interface';

export interface HandoffResult {
  shouldHandoff: boolean;
  reason?: string;
}

const DEFAULT_HUMAN_REQUEST_KEYWORDS = [
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
];

@Injectable()
export class HandoffService {
  private readonly logger = new Logger(HandoffService.name);

  constructor(
    @Inject(SESSION_STATE_STORE)
    private readonly stateStore: SessionStateStore,
    private readonly prisma: PrismaService,
  ) {}

  private getHumanRequestKeywords(value?: string | null): string[] {
    const keywords = (value || '')
      .split(',')
      .map((kw) => kw.trim().toLowerCase())
      .filter(Boolean);

    return keywords.length > 0 ? keywords : DEFAULT_HUMAN_REQUEST_KEYWORDS;
  }

  /**
   * Check if a visitor message contains a request for a human agent.
   */
  async detectHumanRequest(message: string): Promise<boolean> {
    const lower = message.toLowerCase();
    const config = await this.prisma.aiAgentConfig.findFirst({
      select: { humanRequestKeywords: true },
    });
    return this.getHumanRequestKeywords(config?.humanRequestKeywords).some((kw) => lower.includes(kw));
  }

  /**
   * Record a human request and check if threshold is met.
   */
  async recordHumanRequest(conversationId: string, threshold: number): Promise<HandoffResult> {
    const key = `human_request:${conversationId}`;
    const count = await this.stateStore.increment(key, 3600);

    if (count >= threshold) {
      return { shouldHandoff: true, reason: `Customer requested human agent ${count} times` };
    }
    return { shouldHandoff: false };
  }

  /**
   * Record a RAG failure (zero results) and check if threshold is met.
   */
  async recordRagFailure(conversationId: string, threshold: number): Promise<HandoffResult> {
    const key = `rag_failure:${conversationId}`;
    const count = await this.stateStore.increment(key, 3600);

    if (count >= threshold) {
      return { shouldHandoff: true, reason: `Knowledge base returned no results ${count} consecutive times` };
    }
    return { shouldHandoff: false };
  }

  /**
   * Reset the RAG failure counter (called when RAG returns results).
   */
  async resetRagFailure(conversationId: string): Promise<void> {
    await this.stateStore.reset(`rag_failure:${conversationId}`);
  }

  /**
   * Record an AI failure (error, timeout, etc.) and check threshold.
   */
  async recordAiFailure(conversationId: string): Promise<HandoffResult> {
    const key = `ai_failure:${conversationId}`;
    const count = await this.stateStore.increment(key, 3600);

    if (count >= 3) {
      return { shouldHandoff: true, reason: `AI failed to respond ${count} times` };
    }
    return { shouldHandoff: false };
  }

  /**
   * Record AI token usage and check session budget.
   */
  async recordTokenUsage(conversationId: string, tokens: number, budget: number): Promise<HandoffResult> {
    const key = `tokens_used:${conversationId}`;
    const current = await this.stateStore.get(key);
    const total = current + tokens;
    await this.stateStore.set(key, total, 86400); // 24h TTL

    if (total >= budget) {
      return { shouldHandoff: true, reason: `AI token budget exhausted (${total}/${budget} tokens used)` };
    }
    return { shouldHandoff: false };
  }

  /**
   * Record AI turn count and check limit.
   */
  async recordTurn(conversationId: string, maxTurns: number): Promise<HandoffResult> {
    const key = `turn_count:${conversationId}`;
    const count = await this.stateStore.increment(key, 86400);

    if (count >= maxTurns) {
      return { shouldHandoff: true, reason: `Maximum AI conversation turns reached (${count}/${maxTurns})` };
    }
    return { shouldHandoff: false };
  }

  /**
   * Execute the handoff: update conversation state and persist.
   */
  async executeHandoff(conversationId: string, reason: string): Promise<void> {
    this.logger.log(`Handoff triggered for ${conversationId}: ${reason}`);

    // Update or create AI conversation state
    const existing = await this.prisma.aiConversationState.findUnique({
      where: { conversationId },
    });

    if (existing) {
      await this.prisma.aiConversationState.update({
        where: { conversationId },
        data: {
          handoffTriggered: true,
          handoffReason: reason,
          isAiHandling: false,
        },
      });
    } else {
      await this.prisma.aiConversationState.create({
        data: {
          conversationId,
          handoffTriggered: true,
          handoffReason: reason,
          isAiHandling: false,
        },
      });
    }
  }

  /**
   * Check if a conversation has already been handed off.
   */
  async isHandedOff(conversationId: string): Promise<boolean> {
    const state = await this.prisma.aiConversationState.findUnique({
      where: { conversationId },
    });
    return state?.handoffTriggered ?? false;
  }

  /**
   * Check if AI is handling a conversation.
   */
  async isAiHandling(conversationId: string): Promise<boolean> {
    const state = await this.prisma.aiConversationState.findUnique({
      where: { conversationId },
    });
    // If no state exists, AI should handle (default behavior when AI is enabled)
    return state?.isAiHandling ?? true;
  }

  /**
   * Initialize AI conversation state for a new conversation.
   */
  async initConversation(conversationId: string): Promise<void> {
    try {
      await this.prisma.aiConversationState.create({
        data: {
          conversationId,
          isAiHandling: true,
        },
      });
    } catch {
      // Already exists, ignore
    }
  }
}
