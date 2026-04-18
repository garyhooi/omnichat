import { z } from 'zod';

/**
 * Interface for AI tool handlers.
 * Tools are registered in the ToolRegistry and made available to the AI model.
 */
export interface ToolHandler {
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
  execute(args: any, context: ToolContext): Promise<any>;
}

export interface ToolContext {
  conversationId: string;
  visitorId?: string;
  metadata?: Record<string, any>;
  /** Injected services — available for built-in tools that need DB access */
  services?: {
    prisma?: any;
    siteConfigService?: any;
  };
}
