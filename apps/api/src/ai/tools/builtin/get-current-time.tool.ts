import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

export class GetCurrentTimeTool implements ToolHandler {
  name = 'get_current_time';
  description =
    'Get the current server time (UTC) and the visitor\'s local timezone. ' +
    'Use this when the user asks about the current time, date, or anything time-sensitive.';
  parameters = z.object({});

  async execute(_args: Record<string, never>, context: ToolContext): Promise<any> {
    const now = new Date();
    const utcTime = now.toISOString();

    // Retrieve visitor timezone from conversation record
    let visitorTimezone: string | null = null;
    const prisma = context.services?.prisma;
    if (prisma && context.conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: context.conversationId },
        select: { visitorTimezone: true },
      });
      visitorTimezone = conversation?.visitorTimezone || null;
    }

    const result: any = {
      utcTime,
      utcDate: now.toISOString().split('T')[0],
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
    };

    if (visitorTimezone) {
      result.visitorTimezone = visitorTimezone;
      result.visitorLocalTime = now.toLocaleString('en-US', { timeZone: visitorTimezone });
    }

    return result;
  }
}
