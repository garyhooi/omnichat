// =============================================================================
// Token spend budgets — per day/week/month/quarter/half-year/year, applied
// globally (agent config) and per provider model. Usage is computed from the
// TokenUsage table; a budget is "exceeded" once cumulative usage in the
// current period reaches the configured limit.
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type BudgetPeriod = 'day' | 'week' | 'month' | 'quarter' | 'halfYear' | 'year';

export const BUDGET_PERIODS: BudgetPeriod[] = ['day', 'week', 'month', 'quarter', 'halfYear', 'year'];

export const BUDGET_PERIOD_LABELS: Record<BudgetPeriod, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  halfYear: 'half year',
  year: 'year',
};

export interface PeriodStatus {
  period: BudgetPeriod;
  /** Configured limit in tokens (null = unlimited). */
  limit: number | null;
  /** Tokens used in the current period. */
  used: number;
  exceeded: boolean;
}

export interface BudgetCheckResult {
  exceeded: boolean;
  /** e.g. "Global month budget (120000/100000 tokens)" — first exceeded limit. */
  reason?: string;
  global: PeriodStatus[];
  provider: { name: string; periods: PeriodStatus[] } | null;
}

interface BudgetLimits {
  maxTokensPerDay?: number | null;
  maxTokensPerWeek?: number | null;
  maxTokensPerMonth?: number | null;
  maxTokensPerQuarter?: number | null;
  maxTokensPerHalfYear?: number | null;
  maxTokensPerYear?: number | null;
}

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  /** UTC start of the current period. */
  periodStart(period: BudgetPeriod): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      case 'week': {
        const dow = now.getUTCDay(); // 0 = Sunday
        const diff = dow === 0 ? -6 : 1 - dow; // weeks start Monday
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
      }
      case 'month':
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      case 'quarter':
        return new Date(Date.UTC(now.getUTCFullYear(), Math.floor(now.getUTCMonth() / 3) * 3, 1));
      case 'halfYear':
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() < 6 ? 0 : 6, 1));
      case 'year':
        return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    }
  }

  private fieldFor(period: BudgetPeriod): keyof BudgetLimits {
    return `maxTokensPer${period[0].toUpperCase()}${period.slice(1)}` as keyof BudgetLimits;
  }

  /** Tokens used in the current period (optionally scoped to one provider). */
  async usageInPeriod(period: BudgetPeriod, providerId?: string): Promise<number> {
    const where: any = { createdAt: { gte: this.periodStart(period) } };
    if (providerId) where.providerId = providerId;
    const agg = await this.prisma.tokenUsage.aggregate({
      where,
      _sum: { totalTokens: true },
    });
    return agg._sum.totalTokens ?? 0;
  }

  private async statusFor(
    scope: 'global' | 'provider',
    limits: BudgetLimits | null,
    providerId?: string,
  ): Promise<PeriodStatus[]> {
    const periods: PeriodStatus[] = [];
    for (const period of BUDGET_PERIODS) {
      const limit = limits?.[this.fieldFor(period)] ?? null;
      // Only query usage for periods that actually have a limit configured —
      // unlimited periods don't need a count.
      const used = limit != null ? await this.usageInPeriod(period, scope === 'provider' ? providerId : undefined) : 0;
      periods.push({ period, limit, used, exceeded: limit != null && used >= limit });
    }
    return periods;
  }

  /** Current budget status for the global config + active provider. */
  async getStatus(): Promise<BudgetCheckResult> {
    const [globalConfig, provider] = await Promise.all([
      this.prisma.aiAgentConfig.findFirst(),
      this.prisma.aiProvider.findFirst({ where: { isActive: true } }),
    ]);

    const global = await this.statusFor('global', globalConfig);
    const providerStatus = provider
      ? {
          name: provider.name,
          periods: await this.statusFor('provider', provider, provider.id),
        }
      : null;

    let firstExceeded: { scope: string; period: string; used: number; limit: number | null } | null = null;
    for (const p of global) {
      if (p.exceeded) {
        firstExceeded = { scope: 'Global', period: BUDGET_PERIOD_LABELS[p.period], used: p.used, limit: p.limit };
        break;
      }
    }
    if (!firstExceeded && providerStatus) {
      for (const p of providerStatus.periods) {
        if (p.exceeded) {
          firstExceeded = { scope: `Provider ${providerStatus.name}`, period: BUDGET_PERIOD_LABELS[p.period], used: p.used, limit: p.limit };
          break;
        }
      }
    }

    return {
      exceeded: !!firstExceeded,
      reason: firstExceeded
        ? `${firstExceeded.scope} ${firstExceeded.period} budget reached (${firstExceeded.used.toLocaleString()}/${firstExceeded.limit?.toLocaleString()} tokens)`
        : undefined,
      global,
      provider: providerStatus,
    };
  }

  /** One-shot check used before AI responses. */
  async check(): Promise<BudgetCheckResult> {
    return this.getStatus();
  }
}
