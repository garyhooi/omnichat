// =============================================================================
// Reports — token usage & spend analytics for admins.
// All endpoints are JWT-protected (admin/developer roles + IP allowlist).
// =============================================================================

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { PrismaService } from '../prisma/prisma.service';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

class ReportQueryDto {
  @IsDateString() @IsOptional() from?: string;
  @IsDateString() @IsOptional() to?: string;
  /** Filter conversations by assigned/specialist agent username or visitor name. */
  @IsString() @IsOptional() @MaxLength(200) username?: string;
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
  constructor(private readonly prisma: PrismaService) {}

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
          agent: c.assignedUsername ?? c.specialistUsername ?? '—',
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
}
