import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ToolHandler, ToolContext } from './tool.interface';
import { ExternalToolAuthService } from './external-tool-auth.service';
import { tool, jsonSchema } from 'ai';
import { z } from 'zod';

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly builtinTools = new Map<string, ToolHandler>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: ExternalToolAuthService,
  ) {}

  /**
   * Register a built-in tool handler.
   */
  registerBuiltin(handler: ToolHandler): void {
    this.builtinTools.set(handler.name, handler);
    this.logger.log(`Registered builtin tool: ${handler.name}`);
  }

  /**
   * Convert a ZodObject to a clean JSON Schema (no $schema, no additionalProperties).
   * Azure/OpenRouter require ALL properties to be listed in required, so optional
   * properties are included with defaults in `required` when present.
   */
  private zodToCleanJsonSchema(zodObj: z.ZodObject<any>): Record<string, any> {
    const shape = zodObj.shape;
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const [key, field] of Object.entries(shape)) {
      const zodField = field as z.ZodTypeAny;

      let type = 'string';
      if (zodField instanceof z.ZodNumber) type = 'number';
      else if (zodField instanceof z.ZodBoolean) type = 'boolean';

      const prop: Record<string, any> = { type };

      // Unwrap optional/nullable/default wrappers to reach inner type
      let inner = zodField;
      while (inner instanceof z.ZodOptional || inner instanceof z.ZodNullable || inner instanceof z.ZodDefault) {
        if (inner instanceof z.ZodDefault && inner._def.defaultValue !== undefined) {
          prop.default = typeof inner._def.defaultValue === 'function'
            ? inner._def.defaultValue()
            : inner._def.defaultValue;
        }
        inner = inner._def.innerType;
      }
      if (inner._def.description) {
        prop.description = inner._def.description;
      }

      properties[key] = prop;
      required.push(key);
    }

    return { type: 'object', properties, required };
  }

  /**
   * Get all active tools formatted for Vercel AI SDK.
   * Combines built-in tools with external tools from the database.
   */
  async getTools(context: ToolContext): Promise<Record<string, any>> {
    const tools: Record<string, any> = {};

    // Add built-in tools
    for (const [name, handler] of this.builtinTools) {
      const cleanSchema = handler.parameters instanceof z.ZodObject
        ? this.zodToCleanJsonSchema(handler.parameters)
        : { type: 'object', properties: {} };
      tools[name] = tool({
        description: handler.description,
        parameters: jsonSchema(cleanSchema),
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
    let externalTools: any[] = [];
    try {
      externalTools = await this.prisma.toolRegistration.findMany({
        where: { isActive: true, handlerType: 'external' },
      });
    } catch (error: any) {
      this.logger.error(`Failed to query external tools: ${error.message}`);
    }

    for (const ext of externalTools) {
      try {
        const schema = JSON.parse(ext.parametersSchema);
        const authConfig: Record<string, any> | null = ext.authConfig
          ? JSON.parse(ext.authConfig)
          : null;
        const properties: Record<string, any> = {};
        for (const [key, def] of Object.entries(schema)) {
          const prop = def as any;
          const paramSchema: Record<string, any> = { type: prop.type || 'string' };
          if (prop.description) paramSchema.description = prop.description;
          properties[key] = paramSchema;
        }

        const required = Object.keys(schema);

        tools[ext.name] = tool({
          description: ext.description,
          parameters: jsonSchema({
            type: 'object',
            properties,
            ...(required.length > 0 ? { required } : {}),
          }),
          execute: async (args) => {
            try {
              this.logger.log(`Executing external tool: ${ext.name} -> ${ext.endpoint}`);

              let token: string | null = null;
              if (authConfig && ext.authType && ext.authType !== 'none') {
                try {
                  token = await this.authService.getToken(authConfig, ext.authType, context);
                } catch (authError: any) {
                  this.logger.error(`Auth failed for tool ${ext.name}: ${authError.message}`);
                  return { error: `Authentication failed: ${authError.message}` };
                }
              }

              return await this.callExternalTool(ext.endpoint!, token, args);
            } catch (error: any) {
              this.logger.error(`External tool ${ext.name} failed: ${error.message}`);
              return { error: `External tool execution failed: ${error.message}` };
            }
          },
        });
        this.logger.log(`Loaded external tool: ${ext.name}`);
      } catch (error: any) {
        this.logger.error(`Failed to load external tool ${ext.name}: ${error.message}`);
      }
    }

    this.logger.log(`getTools returning: ${Object.keys(tools).join(', ') || '(none)'}`);
    return tools;
  }

  /**
   * Call an external tool via HTTP POST.
   */
  private async callExternalTool(endpoint: string, token: string | null, args: any): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
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
