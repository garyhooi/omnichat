import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ToolHandler, ToolContext } from './tool.interface';
import { ExternalToolAuthService, TokenExchangeError } from './external-tool-auth.service';
import { ToolLogService } from '../../http-log/tool-log.service';
import { tool, jsonSchema } from 'ai';
import { z } from 'zod';

const SENSITIVE_HEADERS = new Set([
  'authorization', 'cookie', 'x-admin-api-key', 'set-cookie',
]);

function sanitiseHeaders(
  raw: Record<string, string | string[]> | undefined,
): string | undefined {
  if (!raw) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    cleaned[k] = SENSITIVE_HEADERS.has(k.toLowerCase()) ? '***' : v;
  }
  return JSON.stringify(cleaned);
}

function truncateBody(body: any): string | undefined {
  if (body === undefined || body === null) return undefined;
  try {
    const str = typeof body === 'string' ? body : JSON.stringify(body);
    return str.length > 4096 ? str.slice(0, 4096) + '...[truncated]' : str;
  } catch {
    return '[unserializable]';
  }
}

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly builtinTools = new Map<string, ToolHandler>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: ExternalToolAuthService,
    private readonly toolLogService: ToolLogService,
  ) {}

  /** Register a built-in tool handler. */
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

  /** Get active tools formatted for Vercel AI SDK, combining built-in and external tools. */
  async getTools(context: ToolContext): Promise<Record<string, any>> {
    const tools: Record<string, any> = {};

    for (const [name, handler] of this.builtinTools) {
      const cleanSchema = handler.parameters instanceof z.ZodObject
        ? this.zodToCleanJsonSchema(handler.parameters)
        : { type: 'object', properties: {} };
      tools[name] = tool({
        description: handler.description,
        parameters: jsonSchema(cleanSchema),
        execute: async (args) => {
          const start = Date.now();
          try {
            this.logger.log(`Executing builtin tool: ${name}`);
            const result = await handler.execute(args, context);
            const duration = Date.now() - start;
            await this.toolLogService.createLog({
              toolName: name,
              handlerType: 'builtin',
              conversationId: context.conversationId,
              requestBody: JSON.stringify(args),
              responseBody: JSON.stringify(result),
              duration,
              success: true,
            });
            return result;
          } catch (error: any) {
            const duration = Date.now() - start;
            this.logger.error(`Tool ${name} failed: ${error.message}`);
            await this.toolLogService.createLog({
              toolName: name,
              handlerType: 'builtin',
              conversationId: context.conversationId,
              requestBody: JSON.stringify(args),
              errorMessage: error.message,
              duration,
              success: false,
            });
            return { error: `Tool execution failed: ${error.message}` };
          }
        },
      });
    }

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
            const start = Date.now();
            try {
              this.logger.log(`Executing external tool: ${ext.name} -> ${ext.endpoint}`);

              let token: string | null = null;
              let authError: any = null;
              if (authConfig && ext.authType && ext.authType !== 'none') {
                try {
                  token = await this.authService.getToken(authConfig, ext.authType, context);
                } catch (authErr: any) {
                  authError = authErr;
                  const duration = Date.now() - start;
                  const logData: any = {
                    toolName: ext.name,
                    handlerType: 'external',
                    conversationId: context.conversationId,
                    requestUrl: ext.endpoint,
                    requestMethod: 'POST',
                    requestBody: JSON.stringify(args),
                    errorMessage: `Auth failed: ${authErr.message}`,
                    duration,
                    success: false,
                  };
                  if (authErr instanceof TokenExchangeError) {
                    logData.requestUrl = authErr.requestUrl;
                    logData.requestHeaders = JSON.stringify(authErr.requestHeaders);
                    logData.requestBody = authErr.requestBody;
                    logData.responseStatus = authErr.responseStatus;
                    logData.responseBody = authErr.responseBody;
                  }
                  await this.toolLogService.createLog(logData);
                  return { error: `Authentication failed: ${authErr.message}` };
                }
              }

              return await this.callExternalTool(ext.name, ext.endpoint!, token, args, context.conversationId);
            } catch (error: any) {
              const duration = Date.now() - start;
              this.logger.error(`External tool ${ext.name} failed: ${error.message}`);
              await this.toolLogService.createLog({
                toolName: ext.name,
                handlerType: 'external',
                conversationId: context.conversationId,
                requestUrl: ext.endpoint,
                requestMethod: 'POST',
                requestBody: JSON.stringify(args),
                errorMessage: error.message,
                duration,
                success: false,
              });
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

  /** Call an external tool via HTTP POST. */
  private async callExternalTool(
    toolName: string,
    endpoint: string,
    token: string | null,
    args: any,
    conversationId: string | undefined,
  ): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout
    const start = Date.now();

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

      const duration = Date.now() - start;
      let respBody: any;
      let responseBody: string | undefined;
      try {
        respBody = await response.json();
        responseBody = truncateBody(respBody);
      } catch {
        responseBody = undefined;
      }

      await this.toolLogService.createLog({
        toolName,
        handlerType: 'external',
        conversationId,
        requestUrl: endpoint,
        requestMethod: 'POST',
        requestHeaders: sanitiseHeaders(headers),
        requestBody: JSON.stringify(args),
        responseStatus: response.status,
        responseBody,
        duration,
        success: response.ok,
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return respBody;
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Convert JSON Schema to Zod schema properties (string, number, boolean). */
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
