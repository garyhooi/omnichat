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

      const onlineAgents = await prisma.adminUser.count({
        where: {
          isLocked: false,
          isOnline: true,
        },
      });

      let agentsAvailable = onlineAgents > 0;

      // Fallback: check connected agent sockets if DB isOnline is stale
      if (!agentsAvailable) {
        const io = context.services?.io;
        if (io) {
          try {
            const agRoom = context.services?.agentsRoom?.() ?? 'agents';
            const sockets = await io.in(agRoom).fetchSockets();
            agentsAvailable = sockets.some((s: any) => s.data?.user && !s.data?.isVisitor);
          } catch {}
        }
      }

      if (!agentsAvailable) {
        return {
          action: 'unavailable',
          reason: 'No human agent is online right now. Cannot transfer at this time.',
          conversationId: context.conversationId,
        };
      }
    }

    await this.performHandoff(context, args.reason).catch(() => {});

    return {
      action: 'handoff',
      reason: args.reason,
      conversationId: context.conversationId,
    };
  }

  private async performHandoff(context: ToolContext, reason: string): Promise<void> {
    const prisma = context.services?.prisma;
    if (!prisma) return;

    await prisma.conversation.update({
      where: { id: context.conversationId },
      data: { status: 'active' },
    });

    const msg = await prisma.message.create({
      data: {
        conversationId: context.conversationId,
        senderType: 'system',
        senderId: 'system',
        content: 'Transferring you to a human agent. Please wait...',
        messageType: 'text',
      },
    });

    const io = context.services?.io;
    if (io) {
      const convRoom = context.services?.conversationRoom?.(context.conversationId) ?? `conv:${context.conversationId}`;
      const agRoom = context.services?.agentsRoom?.() ?? 'agents';
      io.to(convRoom).to(agRoom).emit('new_message', {
        message: { ...msg, senderDisplayName: 'System' },
      });
      io.to(agRoom).emit('conversation_updated', {
        conversation: { id: context.conversationId, status: 'active' },
      });
      io.to(agRoom).emit('ai_handoff', {
        conversationId: context.conversationId,
        reason,
        timestamp: new Date().toISOString(),
      });
    }

    const existing = await prisma.aiConversationState.findUnique({
      where: { conversationId: context.conversationId },
    });
    if (existing) {
      await prisma.aiConversationState.update({
        where: { conversationId: context.conversationId },
        data: { handoffTriggered: true, handoffReason: reason, isAiHandling: false },
      });
    } else {
      await prisma.aiConversationState.create({
        data: {
          conversationId: context.conversationId,
          handoffTriggered: true,
          handoffReason: reason,
          isAiHandling: false,
        },
      });
    }
  }
}
