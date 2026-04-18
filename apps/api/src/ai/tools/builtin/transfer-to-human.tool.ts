import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

export class TransferToHumanTool implements ToolHandler {
  name = 'transfer_to_human';
  description =
    'Transfer the conversation to a human agent. Use this when: ' +
    '1) The customer explicitly asks to speak with a human, ' +
    '2) You cannot resolve the issue, ' +
    '3) The question requires human judgment or access to systems you cannot reach. ' +
    'IMPORTANT: Before calling this tool, you MUST first call check_human_availability ' +
    'to verify a human agent is available. If no human is available, inform the customer ' +
    'instead of attempting the transfer.';
  parameters = z.object({
    reason: z.string().describe('Brief reason for the transfer'),
  });

  async execute(args: { reason: string }, context: ToolContext): Promise<any> {
    const prisma = context.services?.prisma;
    const siteConfigService = context.services?.siteConfigService;

    // Double-check availability at transfer time (safety net)
    if (prisma && siteConfigService) {
      const config = await siteConfigService.getActiveConfig();
      if (config?.isOfflineMode) {
        return {
          action: 'unavailable',
          reason: 'Human agents are currently in offline mode. Cannot transfer at this time.',
          conversationId: context.conversationId,
        };
      }

      const now = new Date();
      const agentsWithValidSessions = await prisma.adminUser.count({
        where: {
          isLocked: false,
          isOnline: true,
          sessions: {
            some: {
              revoked: false,
              expiresAt: { gt: now },
            },
          },
        },
      });

      if (agentsWithValidSessions === 0) {
        return {
          action: 'unavailable',
          reason: 'No human agent is online right now. Cannot transfer at this time.',
          conversationId: context.conversationId,
        };
      }
    }

    return {
      action: 'handoff',
      reason: args.reason,
      conversationId: context.conversationId,
    };
  }
}
