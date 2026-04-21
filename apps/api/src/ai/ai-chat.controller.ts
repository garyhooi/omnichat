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

/**
 * REST endpoint for AI chat streaming via SSE.
 * Used by the visitor widget's `useChat` composable from `@ai-sdk/vue`.
 * This is a public endpoint (no JWT auth) — secured by conversation validation + rate limiting.
 */
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

    try {
      // Get tools
      const tools = await this.toolRegistry.getTools({
        conversationId,
        visitorId,
        services: {
          prisma: this.prisma,
          siteConfigService: this.siteConfigService,
        },
      });

      // Stream AI response
      const result = await this.aiService.streamChat({
        conversationId,
        messages,
        systemPrompt: agentConfig.systemPrompt,
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
