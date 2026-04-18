import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_STATE_STORE, SessionStateStore } from '../session-state/session-state.interface';

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
}

// Known prompt injection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(a|an)/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?(your\s+)?instructions/i,
  /act\s+as\s+(if\s+you\s+are|a|an)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /system\s*:\s*/i,
  /\[SYSTEM\]/i,
  /\<\|system\|\>/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

@Injectable()
export class AiSecurityService {
  private readonly logger = new Logger(AiSecurityService.name);

  // Global circuit breaker state
  private globalFailureCount = 0;
  private globalFailureResetTime = 0;
  private circuitBreakerOpen = false;

  constructor(
    @Inject(SESSION_STATE_STORE)
    private readonly stateStore: SessionStateStore,
  ) {}

  /**
   * Run all security checks on an incoming visitor message.
   */
  async checkMessage(
    conversationId: string,
    message: string,
    visitorIp: string,
    rateLimitPerMinute: number,
  ): Promise<SecurityCheckResult> {
    // 1. Check circuit breaker
    if (this.circuitBreakerOpen) {
      if (Date.now() > this.globalFailureResetTime) {
        this.circuitBreakerOpen = false;
        this.globalFailureCount = 0;
      } else {
        return { allowed: false, reason: 'AI service temporarily unavailable. Routing to human agent.' };
      }
    }

    // 2. Message length check (prevent token abuse)
    if (message.length > 5000) {
      return { allowed: false, reason: 'Message too long for AI processing' };
    }

    // 3. Prompt injection detection
    if (this.detectInjection(message)) {
      this.logger.warn(`Potential prompt injection detected from ${visitorIp}: "${message.slice(0, 100)}..."`);
      return { allowed: false, reason: 'Message flagged by security filter' };
    }

    // 4. Per-conversation rate limiting
    const rateKey = `ai_rate:${conversationId}`;
    const requestCount = await this.stateStore.increment(rateKey, 60);
    if (requestCount > rateLimitPerMinute) {
      return { allowed: false, reason: 'AI request rate limit exceeded. Please wait.' };
    }

    // 5. Per-IP rate limiting (prevents one IP from spamming multiple conversations)
    const ipRateKey = `ai_ip_rate:${visitorIp}`;
    const ipCount = await this.stateStore.increment(ipRateKey, 60);
    if (ipCount > rateLimitPerMinute * 3) {
      this.logger.warn(`IP rate limit exceeded: ${visitorIp}`);
      return { allowed: false, reason: 'Too many requests. Please try again later.' };
    }

    // 6. Spam detection (repeated identical messages)
    const spamKey = `ai_spam:${conversationId}`;
    const lastMsg = await this.stateStore.get(spamKey);
    const msgHash = this.hashMessage(message);
    if (lastMsg === msgHash) {
      const repeatKey = `ai_repeat:${conversationId}`;
      const repeatCount = await this.stateStore.increment(repeatKey, 300);
      if (repeatCount >= 3) {
        return { allowed: false, reason: 'Duplicate messages detected. Please rephrase your question.' };
      }
    }
    await this.stateStore.set(spamKey, msgHash, 300);

    return { allowed: true };
  }

  /**
   * Detect prompt injection attempts.
   */
  private detectInjection(message: string): boolean {
    return INJECTION_PATTERNS.some((pattern) => pattern.test(message));
  }

  /**
   * Simple numeric hash for spam detection.
   */
  private hashMessage(message: string): number {
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Record a global AI failure for circuit breaker logic.
   */
  recordGlobalFailure(): void {
    this.globalFailureCount++;
    if (this.globalFailureCount >= 5) {
      this.circuitBreakerOpen = true;
      this.globalFailureResetTime = Date.now() + 60_000; // Reset after 1 minute
      this.logger.error('Circuit breaker OPEN: AI provider has failed 5 times in quick succession');
    }
  }

  /**
   * Reset global failure counter (called on successful AI response).
   */
  resetGlobalFailure(): void {
    this.globalFailureCount = 0;
  }
}
