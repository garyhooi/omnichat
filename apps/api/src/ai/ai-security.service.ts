import { Inject, Injectable, Logger } from '@nestjs/common';
import { SESSION_STATE_STORE, SessionStateStore } from '../session-state/session-state.interface';

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
}

interface SecurityPolicy {
  rateLimitPerMinute: number;
  spamIpBlacklistMinutes: number;
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
    policy: number | SecurityPolicy,
  ): Promise<SecurityCheckResult> {
    const securityPolicy = this.normalizePolicy(policy);

    // 1. Check circuit breaker
    if (this.circuitBreakerOpen) {
      if (Date.now() > this.globalFailureResetTime) {
        this.circuitBreakerOpen = false;
        this.globalFailureCount = 0;
      } else {
        return { allowed: false, reason: 'AI service temporarily unavailable. Routing to human agent.' };
      }
    }

    // 2. Check if the IP is temporarily blacklisted.
    if (visitorIp !== 'unknown') {
      const blacklistKey = this.getIpBlacklistKey(visitorIp);
      const blacklistState = await this.stateStore.get(blacklistKey);
      if (blacklistState > 0) {
        return { allowed: false, reason: 'Too many spam requests from this IP. Please try again later.' };
      }
    }

    // 3. Message length check (prevent token abuse)
    if (message.length > 5000) {
      return { allowed: false, reason: 'Message too long for AI processing' };
    }

    // 4. Prompt injection detection
    if (this.detectInjection(message)) {
      this.logger.warn(`Potential prompt injection detected from ${visitorIp}: "${message.slice(0, 100)}..."`);
      return { allowed: false, reason: 'Message flagged by security filter' };
    }

    // 5. Per-conversation rate limiting
    const rateKey = `ai_rate:${conversationId}`;
    const requestCount = await this.stateStore.increment(rateKey, 60);
    if (requestCount > securityPolicy.rateLimitPerMinute) {
      return { allowed: false, reason: 'AI request rate limit exceeded. Please wait.' };
    }

    // 6. Per-IP rate limiting (prevents one IP from spamming multiple conversations)
    const ipRateKey = `ai_ip_rate:${visitorIp}`;
    const ipCount = await this.stateStore.increment(ipRateKey, 60);
    if (ipCount > securityPolicy.rateLimitPerMinute * 3) {
      await this.blacklistIp(visitorIp, securityPolicy.spamIpBlacklistMinutes, 'rate limit exceeded');
      return { allowed: false, reason: 'Too many requests. Please try again later.' };
    }

    // 7. Spam detection (repeated identical messages from the same IP)
    const msgHash = this.hashMessage(message);
    const spamKey = `ai_spam:${visitorIp}:${msgHash}`;
    const seenSameMessage = await this.stateStore.get(spamKey);
    if (seenSameMessage > 0) {
      const repeatKey = `ai_repeat_ip:${visitorIp}`;
      const repeatCount = await this.stateStore.increment(repeatKey, 300);
      if (repeatCount >= 3) {
        await this.blacklistIp(visitorIp, securityPolicy.spamIpBlacklistMinutes, 'repeated duplicate messages');
        return { allowed: false, reason: 'Duplicate messages detected. Please rephrase your question.' };
      }
    } else {
      await this.stateStore.set(spamKey, 1, 300);
    }

    return { allowed: true };
  }

  private normalizePolicy(policy: number | SecurityPolicy): SecurityPolicy {
    if (typeof policy === 'number') {
      return {
        rateLimitPerMinute: policy,
        spamIpBlacklistMinutes: 15,
      };
    }

    return {
      rateLimitPerMinute: policy.rateLimitPerMinute ?? 10,
      spamIpBlacklistMinutes: policy.spamIpBlacklistMinutes ?? 15,
    };
  }

  private getIpBlacklistKey(visitorIp: string): string {
    return `ai_ip_blacklist:${visitorIp}`;
  }

  private async blacklistIp(visitorIp: string, blacklistMinutes: number, reason: string): Promise<void> {
    if (!visitorIp || visitorIp === 'unknown') return;

    await this.stateStore.set(this.getIpBlacklistKey(visitorIp), 1, blacklistMinutes * 60);
    this.logger.warn(`Blacklisted IP ${visitorIp} for ${blacklistMinutes} minute(s): ${reason}`);
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
