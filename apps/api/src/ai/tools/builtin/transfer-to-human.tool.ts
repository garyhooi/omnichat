import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

export class TransferToHumanTool implements ToolHandler {
  name = 'transfer_to_human';
  description = 'Transfer the conversation to a human agent. Use this when: 1) The customer explicitly asks to speak with a human, 2) You cannot resolve the issue, 3) The question requires human judgment or access to systems you cannot reach.';
  parameters = z.object({
    reason: z.string().describe('Brief reason for the transfer'),
  });

  async execute(args: { reason: string }, context: ToolContext): Promise<any> {
    return {
      action: 'handoff',
      reason: args.reason,
      conversationId: context.conversationId,
    };
  }
}
