import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

export class GetVisitorInfoTool implements ToolHandler {
  name = 'get_visitor_info';
  description =
    'Get the current visitor\'s information including their name, email, browser, OS, device, screen resolution, current page URL, referrer, timezone, and language. ' +
    'IMPORTANT: You MUST call this tool before your very first response in every conversation to retrieve the visitor\'s name for a personalized greeting, ' +
    'and to understand their environment for debugging. Use the visitor\'s name (if available) to greet them personally. ' +
    'The visitor\'s browser, OS, device, and current page URL are essential for diagnosing technical issues.';
  parameters = z.object({});

  async execute(_args: Record<string, never>, context: ToolContext): Promise<any> {
    const prisma = context.services?.prisma;
    if (!prisma || !context.conversationId) {
      return { error: 'Visitor information unavailable — conversation context missing.' };
    }

    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: context.conversationId },
        select: {
          assignedUsername: true,
          metadata: true,
          visitorIp: true,
          visitorBrowser: true,
          visitorOs: true,
          visitorDevice: true,
          visitorScreenRes: true,
          visitorCurrentUrl: true,
          visitorReferrer: true,
          visitorTimezone: true,
          visitorLanguage: true,
        },
      });

      if (!conversation) {
        return { error: 'Conversation not found.' };
      }

      // Parse metadata JSON to extract visitor name and email
      let visitorName: string | null = null;
      let visitorEmail: string | null = null;
      if (conversation.metadata) {
        try {
          const parsed = JSON.parse(conversation.metadata);
          visitorName = parsed.visitorName || null;
          visitorEmail = parsed.visitorEmail || null;
        } catch {
          // metadata is not valid JSON, ignore
        }
      }

      return {
        customer: {
          username: conversation.assignedUsername || null,
          name: visitorName,
          email: visitorEmail,
        },
        visitorInfo: {
          ip: conversation.visitorIp || null,
          browser: conversation.visitorBrowser || null,
          os: conversation.visitorOs || null,
          device: conversation.visitorDevice || null,
          screenResolution: conversation.visitorScreenRes || null,
        },
        sessionContext: {
          currentUrl: conversation.visitorCurrentUrl || null,
          referrer: conversation.visitorReferrer || null,
          timezone: conversation.visitorTimezone || null,
          language: conversation.visitorLanguage || null,
        },
      };
    } catch (error: any) {
      return { error: `Failed to retrieve visitor information: ${error.message}` };
    }
  }
}
