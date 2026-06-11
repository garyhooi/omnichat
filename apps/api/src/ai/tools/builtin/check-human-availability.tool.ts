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
      return { available: false, reason: 'Unable to check availability at this time.' };
    }

    const config = await siteConfigService.getActiveConfig();
    if (config?.isOfflineMode) {
      return { available: false, reason: 'Human agents are currently in offline mode. No human agent is available right now.' };
    }

    // Check DB first: non-locked, online agents
    const onlineAgents = await prisma.adminUser.count({
      where: { isLocked: false, isOnline: true },
    });

    if (onlineAgents > 0) {
      return {
        available: true,
        onlineAgentCount: onlineAgents,
        reason: `${onlineAgents} human agent(s) are currently online and available.`,
      };
    }

    // Fallback: check for connected agent sockets (DB isOnline can be stale)
    const io = context.services?.io;
    if (io) {
      try {
        const agRoom = context.services?.agentsRoom?.() ?? 'agents';
        const sockets = await io.in(agRoom).fetchSockets();
        const agentSockets = sockets.filter((s: any) => s.data?.user && !s.data?.isVisitor);
        if (agentSockets.length > 0) {
          return {
            available: true,
            onlineAgentCount: agentSockets.length,
            reason: `${agentSockets.length} human agent(s) are currently online and available.`,
          };
        }
      } catch {
        // Ignore fetchSockets errors (e.g. not connected)
      }
    }

    return { available: false, reason: 'No human agent is online right now. Please try again later.' };
  }
}
