import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

export class CheckHumanAvailabilityTool implements ToolHandler {
  name = 'check_human_availability';
  description =
    'Check if human agents are currently available to handle conversations. ' +
    'Use this BEFORE attempting to transfer to a human agent. ' +
    'Returns whether human agents are available and the reason if not.';
  parameters = z.object({});

  async execute(_args: Record<string, never>, context: ToolContext): Promise<any> {
    const prisma = context.services?.prisma;
    const siteConfigService = context.services?.siteConfigService;

    if (!prisma || !siteConfigService) {
      return {
        available: false,
        reason: 'Unable to check availability at this time.',
      };
    }

    // Check 1: Is human offline mode enabled?
    const config = await siteConfigService.getActiveConfig();
    if (config?.isOfflineMode) {
      return {
        available: false,
        reason: 'Human agents are currently in offline mode. No human agent is available right now.',
      };
    }

    // Check 2: Are there any non-locked agents with at least one valid session?
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
        available: false,
        reason: 'No human agent is online right now. Please try again later.',
      };
    }

    return {
      available: true,
      onlineAgentCount: agentsWithValidSessions,
      reason: `${agentsWithValidSessions} human agent(s) are currently online and available.`,
    };
  }
}
