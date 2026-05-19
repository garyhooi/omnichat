import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AiService } from './ai.service';
import { AiConfigService } from './ai-config.service';
import { HandoffService } from './handoff.service';
import { AiSecurityService } from './ai-security.service';
import { ToolRegistry } from './tools/tool-registry';
import { PrismaService } from '../prisma/prisma.service';
import { SiteConfigService } from '../config/site-config.service';
import { CoreMessage } from 'ai';

interface ChatRequestBody {
  messages: CoreMessage[];
  conversationId: string;
  visitorId?: string;
}

/** REST endpoint for AI chat streaming via SSE. */
@Controller('ai/chat')
export class AiChatController {
  constructor(
    private readonly aiService: AiService,
    private readonly aiConfigService: AiConfigService,
    private readonly handoffService: HandoffService,
    private readonly securityService: AiSecurityService,
    private readonly toolRegistry: ToolRegistry,
    private readonly prisma: PrismaService,
    private readonly siteConfigService: SiteConfigService,
  ) {}

  @Post()
  async chat(
    @Body() body: ChatRequestBody,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { messages, conversationId, visitorId } = body;

    if (!conversationId || !messages?.length) {
      throw new HttpException('Missing conversationId or messages', HttpStatus.BAD_REQUEST);
    }

    // Check if AI is enabled
    const agentConfig = await this.aiConfigService.getAgentConfig();
    if (!agentConfig?.enabled) {
      throw new HttpException('AI agent is not enabled', HttpStatus.SERVICE_UNAVAILABLE);
    }

    // Check if conversation already handed off
    const handedOff = await this.handoffService.isHandedOff(conversationId);
    if (handedOff) {
      throw new HttpException('Conversation has been transferred to a human agent', HttpStatus.GONE);
    }

    // Security checks
    const lastMessage = messages[messages.length - 1];
    const messageContent = typeof lastMessage.content === 'string' ? lastMessage.content : '';
    const visitorIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';

    const securityCheck = await this.securityService.checkMessage(
      conversationId,
      messageContent,
      visitorIp,
      {
        rateLimitPerMinute: agentConfig.aiRateLimitPerMinute,
        spamIpBlacklistMinutes: agentConfig.spamIpBlacklistMinutes,
      },
    );

    if (!securityCheck.allowed) {
      throw new HttpException(securityCheck.reason || 'Request blocked', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Check turn limit
    const turnCheck = await this.handoffService.recordTurn(
      conversationId,
      agentConfig.maxTurnsPerConversation,
    );
    if (turnCheck.shouldHandoff) {
      await this.handoffService.executeHandoff(conversationId, turnCheck.reason!);
      throw new HttpException('Maximum conversation turns reached. Transferring to human agent.', HttpStatus.GONE);
    }

    // Check for human request in message
    if (await this.handoffService.detectHumanRequest(messageContent)) {
      const humanCheck = await this.handoffService.recordHumanRequest(
        conversationId,
        agentConfig.humanRequestThreshold,
      );
      if (humanCheck.shouldHandoff) {
        await this.handoffService.executeHandoff(conversationId, humanCheck.reason!);
        throw new HttpException('Transferring to human agent as requested.', HttpStatus.GONE);
      }
    }

    // Check if any message contains image content
    const hasImageContent = messages.some((m) =>
      Array.isArray(m.content) && m.content.some((p) => typeof p === 'object' && p !== null && 'image' in p && (p as any).type === 'image'),
    );

    if (hasImageContent) {
      const supportsImages = await this.aiService.supportsImages();
      if (!supportsImages) {
        throw new HttpException(
          'The AI model does not support image processing. Please describe your request with text only.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      // Fetch conversation to get metadata (includes externalAuthToken)
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      let parsedMetadata: Record<string, any> = {};
      if (conversation?.metadata) {
        try {
          parsedMetadata = JSON.parse(conversation.metadata);
        } catch {}
      }

      // Get tools
      const tools = await this.toolRegistry.getTools({
        conversationId,
        visitorId,
        metadata: parsedMetadata,
        services: {
          prisma: this.prisma,
          siteConfigService: this.siteConfigService,
        },
      });

      // Append tool descriptions to system prompt so the model knows what tools are available
      const toolNames = Object.keys(tools);
      let systemPrompt = agentConfig.systemPrompt;
      if (toolNames.length > 0) {
        const toolList = toolNames
          .map((name) => {
            const t = tools[name];
            const desc = t.description ? `: ${t.description}` : '';
            return `- ${name}${desc}`;
          })
          .join('\n');
        systemPrompt += `\n\nYou have access to the following tools:\n${toolList}\n\nIMPORTANT: You MUST use the tools above to answer user queries when relevant. Never pretend to call a tool or make up information. If a tool exists for what the user asks, call it using the exact tool name and provide the required parameters. If you call a tool, wait for the result and use it in your response. Never simulate tool execution or generate fictional data.`;
      }

      // Create abort controller for client disconnect
      const abortController = new AbortController();
      const onReqClose = () => {
        abortController.abort();
        req.off('close', onReqClose);
      };
      req.on('close', onReqClose);

      // Stream AI response
      const result = await this.aiService.streamChat({
        conversationId,
        messages,
        abortSignal: abortController.signal,
        systemPrompt,
        tools,
        maxTokens: agentConfig.maxTokensPerResponse,
        temperature: agentConfig.temperature,
        onFinish: async ({ text, usage }) => {
          // Track token usage
          if (usage.totalTokens > 0) {
            const tokenCheck = await this.handoffService.recordTokenUsage(
              conversationId,
              usage.totalTokens,
              agentConfig.maxTokensPerSession,
            );
            if (tokenCheck.shouldHandoff) {
              await this.handoffService.executeHandoff(conversationId, tokenCheck.reason!);
            }
          }
          this.securityService.resetGlobalFailure();
        },
      });

      // Pipe the stream as SSE using Vercel AI SDK data stream protocol
      const stream = result.toDataStream();
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
      
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          if (abortController.signal.aborted) {
            reader.cancel();
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } finally {
        res.end();
      }
    } catch (error: any) {
      this.securityService.recordGlobalFailure();

      // Record AI failure
      const failureResult = await this.handoffService.recordAiFailure(conversationId);
      if (failureResult.shouldHandoff) {
        await this.handoffService.executeHandoff(conversationId, failureResult.reason!);
      }

      // Check for specific error types
      if (error.status === 402 || error.status === 429 || error.message?.includes('quota') || error.message?.includes('credit')) {
        await this.handoffService.executeHandoff(conversationId, 'AI provider credit/quota exhausted');
        throw new HttpException('AI service unavailable. Transferring to human agent.', HttpStatus.SERVICE_UNAVAILABLE);
      }

      throw new HttpException(
        'AI service error. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
