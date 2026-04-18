import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ToolHandler, ToolContext } from './tool.interface';
import { tool } from 'ai';
import { z } from 'zod';

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly builtinTools = new Map<string, ToolHandler>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register a built-in tool handler.
   */
  registerBuiltin(handler: ToolHandler): void {
    this.builtinTools.set(handler.name, handler);
    this.logger.log(`Registered builtin tool: ${handler.name}`);
  }

  /**
   * Get all active tools formatted for Vercel AI SDK.
   * Combines built-in tools with external tools from the database.
   */
  async getTools(context: ToolContext): Promise<Record<string, any>> {
    const tools: Record<string, any> = {};

    // Add built-in tools
    for (const [name, handler] of this.builtinTools) {
      tools[name] = tool({
        description: handler.description,
        parameters: handler.parameters,
        execute: async (args) => {
          try {
            this.logger.log(`Executing builtin tool: ${name}`);
            return await handler.execute(args, context);
          } catch (error: any) {
            this.logger.error(`Tool ${name} failed: ${error.message}`);
            return { error: `Tool execution failed: ${error.message}` };
          }
        },
      });
    }

    // Add external tools from database
    try {
      const externalTools = await this.prisma.toolRegistration.findMany({
        where: { isActive: true, handlerType: 'external' },
      });

      for (const ext of externalTools) {
        const schema = JSON.parse(ext.parametersSchema);
        tools[ext.name] = tool({
          description: ext.description,
          parameters: z.object(this.jsonSchemaToZod(schema)),
          execute: async (args) => {
            try {
              this.logger.log(`Executing external tool: ${ext.name} -> ${ext.endpoint}`);
              return await this.callExternalTool(ext.endpoint!, args);
            } catch (error: any) {
              this.logger.error(`External tool ${ext.name} failed: ${error.message}`);
              return { error: `External tool execution failed: ${error.message}` };
            }
          },
        });
      }
    } catch (error: any) {
      this.logger.error(`Failed to load external tools: ${error.message}`);
    }

    return tools;
  }

  /**
   * Call an external tool via HTTP POST.
   */
  private async callExternalTool(endpoint: string, args: any): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Convert a simple JSON Schema to Zod schema properties.
   * Supports basic types: string, number, boolean.
   */
  private jsonSchemaToZod(schema: Record<string, any>): Record<string, z.ZodTypeAny> {
    const zodProps: Record<string, z.ZodTypeAny> = {};

    for (const [key, def] of Object.entries(schema)) {
      const prop = def as any;
      switch (prop.type) {
        case 'string':
          zodProps[key] = prop.required === false
            ? z.string().optional().describe(prop.description || '')
            : z.string().describe(prop.description || '');
          break;
        case 'number':
          zodProps[key] = prop.required === false
            ? z.number().optional().describe(prop.description || '')
            : z.number().describe(prop.description || '');
          break;
        case 'boolean':
          zodProps[key] = prop.required === false
            ? z.boolean().optional().describe(prop.description || '')
            : z.boolean().describe(prop.description || '');
          break;
        default:
          zodProps[key] = z.string().optional().describe(prop.description || '');
      }
    }

    return zodProps;
  }
}
