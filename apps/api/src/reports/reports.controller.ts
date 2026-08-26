// =============================================================================
// Reports — token usage & spend analytics for admins.
// All endpoints are JWT-protected (admin/developer roles + IP allowlist).
// =============================================================================

import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { PrismaService } from '../prisma/prisma.service';
import { generateText } from 'ai';
import { AiProviderFactory } from '../ai/ai-provider.factory';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

class ReportQueryDto {
  @IsDateString() @IsOptional() from?: string;
  @IsDateString() @IsOptional() to?: string;
  /** Filter conversations by assigned/specialist agent username or visitor name. */
  @IsString() @IsOptional() @MaxLength(200) username?: string;
}

class AiReviewDto {
  @IsDateString() @IsOptional() from?: string;
  @IsDateString() @IsOptional() to?: string;
  @IsString() @IsOptional() @MaxLength(200) username?: string;
  /** Optional — a configured AI provider id; defaults to the active provider. */
  @IsString() @IsOptional() @MaxLength(64) providerId?: string;
  /** Optional — reply language name; defaults to English. */
  @IsString() @IsOptional() @MaxLength(20) lang?: string;
  /** Optional — review feedback for a single agent only; defaults to all agents. */
  @IsString() @IsOptional() @MaxLength(200) agent?: string;
}

interface UsageTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  calls: number;
  conversations: number;
}

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard, AdminIpAllowlistGuard)
export class ReportsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  private range(q: ReportQueryDto): { gte: Date; lte: Date } {
    let to = q.to ? new Date(q.to) : new Date();
    if (!q.to) {
      // Whole current day when `to` was omitted.
      to.setHours(23, 59, 59, 999);
    } else if (
      to.getUTCHours() === 0 &&
      to.getUTCMinutes() === 0 &&
      to.getUTCSeconds() === 0
    ) {
      // Date-only values ("2026-08-16") parse as UTC midnight — include the
      // entire day so records later that day aren't cut off.
      to = new Date(to.getTime() + 24 * 3600 * 1000 - 1);
    }
    const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 24 * 3600 * 1000);
    return { gte: from, lte: to };
  }

  /** Conversations that match the optional username filter (agent or visitor). */
  private async filterConversations(
    ids: string[],
    username?: string,
  ): Promise<Map<string, any>> {
    if (ids.length === 0) return new Map();
    const conversations = await this.prisma.conversation.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        status: true,
        assignedUsername: true,
        specialistUsername: true,
        metadata: true,
        updatedAt: true,
        agent: { select: { username: true } },
      },
    });
    const map = new Map(conversations.map((c) => [c.id, c]));
    if (username) {
      const q = username.toLowerCase();
      for (const [id, c] of map) {
        const meta = this.parseMetadata(c.metadata);
        const visitorName = (meta.visitorName ?? '').toLowerCase();
        const agent = ((c.assignedUsername ?? '') + ' ' + (c.specialistUsername ?? '')).toLowerCase();
        if (!agent.includes(q) && !visitorName.includes(q)) map.delete(id);
      }
    }
    return map;
  }

  private parseMetadata(metadata: string | null): { visitorName?: string } {
    try {
      return JSON.parse(metadata ?? '{}') as { visitorName?: string };
    } catch {
      return {};
    }
  }

  private emptyTotals(): UsageTotals {
    return { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, calls: 0, conversations: 0 };
  }

  // -------------------------------------------------------------------------
  // Per-conversation token usage with totals — the main report table.
  // -------------------------------------------------------------------------
  @Get('token-usage')
  @Roles('admin', 'developer')
  async tokenUsage(@Query() q: ReportQueryDto) {
    const { gte, lte } = this.range(q);
    const grouped = await this.prisma.tokenUsage.groupBy({
      by: ['conversationId'],
      where: { createdAt: { gte, lte } },
      _sum: { promptTokens: true, completionTokens: true, totalTokens: true, cost: true },
      _count: true,
    });

    const convMap = await this.filterConversations(
      grouped.map((g) => g.conversationId),
      q.username,
    );

    const totals = this.emptyTotals();
    const rows = grouped
      .filter((g) => convMap.has(g.conversationId))
      .map((g) => {
        const c = convMap.get(g.conversationId)!;
        const meta = this.parseMetadata(c.metadata);
        const prompt = g._sum.promptTokens ?? 0;
        const completion = g._sum.completionTokens ?? 0;
        const total = g._sum.totalTokens ?? 0;
        const cost = g._sum.cost ?? 0;
        totals.promptTokens += prompt;
        totals.completionTokens += completion;
        totals.totalTokens += total;
        totals.cost += cost;
        totals.calls += g._count;
        totals.conversations += 1;
        return {
          conversationId: g.conversationId,
          visitorName: meta.visitorName ?? 'Visitor',
          ticketId: g.conversationId.slice(-8).toUpperCase(),
          agent: c.agent?.username ?? c.specialistUsername ?? '—',
          assignedUsername: c.assignedUsername ?? null,
          status: c.status,
          calls: g._count,
          promptTokens: prompt,
          completionTokens: completion,
          totalTokens: total,
          cost,
          lastUsedAt: c.updatedAt,
        };
      })
      .sort((a, b) => b.cost - a.cost || b.totalTokens - a.totalTokens);

    return { rows, totals };
  }

  // -------------------------------------------------------------------------
  // Daily usage buckets for the month chart.
  // -------------------------------------------------------------------------
  @Get('monthly')
  @Roles('admin', 'developer')
  async monthly(@Query() q: ReportQueryDto) {
    const { gte, lte } = this.range(q);
    const records = await this.prisma.tokenUsage.findMany({
      where: { createdAt: { gte, lte } },
      select: {
        conversationId: true,
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        cost: true,
        createdAt: true,
      },
    });

    const convMap = await this.filterConversations(
      [...new Set(records.map((r) => r.conversationId))],
      q.username,
    );

    interface DayBucket {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      cost: number;
      calls: number;
      conversations: Set<string>;
    }
    const byDay = new Map<string, DayBucket>();
    for (const r of records) {
      if (!convMap.has(r.conversationId)) continue;
      const day = r.createdAt.toISOString().slice(0, 10);
      let bucket = byDay.get(day);
      if (!bucket) {
        bucket = { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, calls: 0, conversations: new Set() };
        byDay.set(day, bucket);
      }
      bucket.promptTokens += r.promptTokens;
      bucket.completionTokens += r.completionTokens;
      bucket.totalTokens += r.totalTokens;
      bucket.cost += r.cost;
      bucket.calls += 1;
      bucket.conversations.add(r.conversationId);
    }

    const rows = [...byDay.entries()]
      .map(([date, b]) => ({
        date,
        calls: b.calls,
        conversations: b.conversations.size,
        promptTokens: b.promptTokens,
        completionTokens: b.completionTokens,
        totalTokens: b.totalTokens,
        cost: b.cost,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { rows };
  }

  // -------------------------------------------------------------------------
  // Dashboard summary — totals, status breakdown, message volume, last 14 days.
  // -------------------------------------------------------------------------
  @Get('summary')
  @Roles('admin', 'developer')
  async summary(@Query() q: ReportQueryDto) {
    const { gte, lte } = this.range(q);
    const grouped = await this.prisma.tokenUsage.groupBy({
      by: ['conversationId'],
      where: { createdAt: { gte, lte } },
      _sum: { promptTokens: true, completionTokens: true, totalTokens: true, cost: true },
      _count: true,
    });
    const convMap = await this.filterConversations(
      grouped.map((g) => g.conversationId),
      q.username,
    );
    const totals = this.emptyTotals();
    for (const g of grouped) {
      if (!convMap.has(g.conversationId)) continue;
      totals.promptTokens += g._sum.promptTokens ?? 0;
      totals.completionTokens += g._sum.completionTokens ?? 0;
      totals.totalTokens += g._sum.totalTokens ?? 0;
      totals.cost += g._sum.cost ?? 0;
      totals.calls += g._count;
      totals.conversations += 1;
    }

    // Conversation status breakdown (respects the username filter).
    const convWhere = {
      ...(q.username
        ? {
            OR: [
              { assignedUsername: { contains: q.username, mode: 'insensitive' as const } },
              { specialistUsername: { contains: q.username, mode: 'insensitive' as const } },
              { metadata: { contains: q.username, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const statusGroups = await this.prisma.conversation.groupBy({
      by: ['status'],
      where: convWhere,
      _count: true,
    });
    const conversationsByStatus: Record<string, number> = {};
    for (const s of statusGroups) {
      conversationsByStatus[s.status] = s._count;
    }
    const conversationsTotal = statusGroups.reduce((n, s) => n + s._count, 0);

    // Message volume per day (last 14 days) + token/cost buckets.
    const dayStart = new Date(lte.getTime());
    dayStart.setDate(dayStart.getDate() - 13);
    dayStart.setHours(0, 0, 0, 0);
    const messages = await this.prisma.message.findMany({
      where: { createdAt: { gte: dayStart, lte } },
      select: { createdAt: true },
    });
    const usageRecords = await this.prisma.tokenUsage.findMany({
      where: { createdAt: { gte: dayStart, lte } },
      select: { conversationId: true, promptTokens: true, completionTokens: true, totalTokens: true, cost: true, createdAt: true },
    });

    const daily: { date: string; messages: number; tokens: number; cost: number }[] = [];
    for (let d = new Date(dayStart); d <= lte; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, messages: 0, tokens: 0, cost: 0 });
    }
    const dayIndex = new Map(daily.map((d) => [d.date, d]));
    for (const m of messages) {
      const k = m.createdAt.toISOString().slice(0, 10);
      const b = dayIndex.get(k);
      if (b) b.messages += 1;
    }
    for (const r of usageRecords) {
      const k = r.createdAt.toISOString().slice(0, 10);
      const b = dayIndex.get(k);
      if (b) {
        b.tokens += r.totalTokens;
        b.cost += r.cost;
      }
    }

    return {
      totals,
      conversationsTotal,
      conversationsByStatus,
      daily,
    };
  }

  // -------------------------------------------------------------------------
  // Agent Performance — visitor satisfaction ratings by agent (AI & human).
  // -------------------------------------------------------------------------
  @Get('agent-performance')
  @Roles('admin', 'developer')
  async agentPerformance(@Query() q: ReportQueryDto) {
    const { gte, lte } = this.range(q);
    const conversations = await this.prisma.conversation.findMany({
      where: { updatedAt: { gte, lte } },
      select: { id: true, status: true, rating: true, review: true, assignedUsername: true, specialistUsername: true, resolvedByUsername: true, createdAt: true, updatedAt: true, metadata: true },
    });
    const agentMap = new Map<string, { agent: string; agentType: 'AI' | 'Human'; conversations: any[] }>();
    for (const conv of conversations) {
      const agentUsername = conv.assignedUsername || conv.specialistUsername || 'Unassigned';
      const agentType = conv.assignedUsername ? 'Human' : 'AI';
      if (!agentMap.has(agentUsername)) agentMap.set(agentUsername, { agent: agentUsername, agentType, conversations: [] });
      agentMap.get(agentUsername)!.conversations.push(conv);
    }
    let filteredMap = agentMap;
    if (q.username) {
      const qLower = q.username.toLowerCase();
      filteredMap = new Map();
      for (const [key, value] of agentMap) { if (key.toLowerCase().includes(qLower)) filteredMap.set(key, value); }
    }
    const totals = { totalConversations: 0, totalRated: 0, overallAverageRating: 0, totalPositiveReviews: 0, totalNegativeReviews: 0, reviewRate: 0 };
    const rows = [...filteredMap.values()].map((item) => {
      const { agent, agentType, conversations: agentConvs } = item;
      const totalConversations = agentConvs.length;
      const ratedConversations = agentConvs.filter(c => c.rating != null).length;
      const ratings = agentConvs.filter(c => c.rating != null).map(c => c.rating!);
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const r of ratings) { const rating = r as number; if (rating >= 1 && rating <= 5) { (ratingDistribution as any)[rating]++; } }
      const positiveReviews = ratings.filter(r => r >= 4).length;
      const negativeReviews = ratings.filter(r => r <= 2).length;
      const resolvedCount = agentConvs.filter(c => c.status === 'resolved').length;
      const resolutionRate = totalConversations > 0 ? resolvedCount / totalConversations : 0;
      totals.totalConversations += totalConversations; totals.totalRated += ratedConversations; totals.totalPositiveReviews += positiveReviews; totals.totalNegativeReviews += negativeReviews;
      return { agent, agentType, totalConversations, ratedConversations, averageRating: Math.round(averageRating * 10) / 10, ratingDistribution, positiveReviews, negativeReviews, totalReviews: ratedConversations, resolutionRate: Math.round(resolutionRate * 100) / 100 };
    }).sort((a, b) => b.averageRating - a.averageRating || b.totalConversations - a.totalConversations);
    if (totals.totalRated > 0) { const allRatings = [...agentMap.values()].flatMap(item => item.conversations.filter(c => c.rating != null).map(c => c.rating!)); totals.overallAverageRating = Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10; }
    if (totals.totalConversations > 0) totals.reviewRate = Math.round((totals.totalRated / totals.totalConversations) * 100) / 100;
    return { rows, totals };
  }

  // -------------------------------------------------------------------------
  // AI review — summarize visitor feedback within the range via a chosen model.
  // -------------------------------------------------------------------------
  @Post('agent-performance/ai-review')
  @Roles('admin', 'developer')
  async aiReview(@Body() q: AiReviewDto) {
    const { gte, lte } = this.range(q);
    const provider = q.providerId
      ? await this.providerFactory.getProviderById(q.providerId)
      : await this.providerFactory.getActiveProvider();
    if (!provider) {
      throw new HttpException(
        'No AI provider configured — add one in AI Setup -> AI Providers.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const conversations = await this.prisma.conversation.findMany({
      where: { updatedAt: { gte, lte }, review: { not: null } },
      select: {
        rating: true,
        review: true,
        assignedUsername: true,
        specialistUsername: true,
      },
    });

    // Group feedback by agent, using the same agent resolution as the report.
    const byAgent = new Map<string, { agentType: 'AI' | 'Human'; reviews: string[] }>();
    const allItems: string[] = [];
    for (const c of conversations) {
      if (!c.review || !c.review.trim()) continue;
      const agentName = c.assignedUsername || c.specialistUsername || 'Unassigned';
      if (q.username && !agentName.toLowerCase().includes(q.username.toLowerCase())) continue;
      if (q.agent && agentName.toLowerCase() !== q.agent.toLowerCase()) continue;
      const agentType = c.assignedUsername ? 'Human' : 'AI';
      if (!byAgent.has(agentName)) byAgent.set(agentName, { agentType, reviews: [] });
      byAgent.get(agentName)!.reviews.push(`[${c.rating ?? '-'}/5] ${c.review.trim()}`);
      allItems.push(c.review.trim());
    }
    if (allItems.length === 0) {
      throw new HttpException(
        q.agent
          ? `No visitor reviews found for "${q.agent}" in the selected range.`
          : 'No visitor reviews found in the selected range.',
        HttpStatus.NOT_FOUND,
      );
    }

    const langName = q.lang || 'English';
    const grouped = [...byAgent.entries()]
      .map(([agent, info]) => `AGENT: ${agent} (${info.agentType})\n${info.reviews.map((r) => `- ${r}`).join('\n')}`)
      .join('\n\n');

    const model = this.providerFactory.createLanguageModel(provider);
    let generated: string;
    try {
      const result = await generateText({
        model,
        system: `You are a customer-experience analyst for a live-chat product. Review the visitor feedback below, grouped by agent. Write a concise report in ${langName}: a one-paragraph overall summary, then one section per agent covering what visitors say the agent does well and what to improve (concrete and actionable), then the top 3 improvement recommendations ranked by impact. Quote short example feedback where useful. Only cover agents that appear in the data.`,
        prompt: grouped,
        temperature: 0.3,
        maxTokens: 2200,
      });
      generated = result.text.trim();
    } catch (error: any) {
      const msg = error?.message ?? '';
      throw new HttpException(
        error?.status === 402 || error?.status === 429 || /quota|credit|insufficient/i.test(msg)
          ? 'AI provider credit/quota exhausted'
          : 'AI review service error. Please try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      review: generated,
      provider: { name: provider.name, model: provider.chatModelId },
      conversationCount: allItems.length,
      agentCount: byAgent.size,
    };
  }
}