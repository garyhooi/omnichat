import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { UploadTokenService } from '../upload/upload-token.service';
import { UAParser } from 'ua-parser-js';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { AiConfigService } from '../ai/ai-config.service';
import { HandoffService } from '../ai/handoff.service';
import { AiSecurityService } from '../ai/ai-security.service';
import { ToolRegistry } from '../ai/tools/tool-registry';
import { RagService } from '../rag/rag.service';
import { AiLogService } from '../ai/ai-log.service';
import { SearchKnowledgeBaseTool } from '../ai/tools/builtin/search-knowledge-base.tool';
import { TransferToHumanTool } from '../ai/tools/builtin/transfer-to-human.tool';
import { GetBusinessHoursTool } from '../ai/tools/builtin/get-business-hours.tool';
import { CoreMessage } from 'ai';

// ---------------------------------------------------------------------------
// Types for inbound/outbound events
// ---------------------------------------------------------------------------
interface JoinConversationPayload {
  conversationId: string;
}

interface SendMessagePayload {
  conversationId: string;
  content?: string;
  messageType?: string;
  attachmentUrl?: string;
  attachmentThumbnailUrl?: string;
}

interface TypingPayload {
  conversationId: string;
}

interface ResolveConversationPayload {
  conversationId: string;
}

interface TransferConversationPayload {
  conversationId: string;
  targetUsername: string;
}

interface StartConversationPayload {
  visitorId: string;
  metadata?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorCurrentUrl?: string;
  visitorTimezone?: string;
  visitorLanguage?: string;
  visitorScreenRes?: string;
  visitorReferrer?: string;
  assignUsername?: string;
}

interface ReadMessagePayload {
  messageId: string;
  conversationId: string;
}

interface SubmitReviewPayload {
  conversationId: string;
  rating: number;
  review?: string;
}

interface UpdateConversationDetailsPayload {
  conversationId: string;
  assignedUsername?: string;
  agentRemarks?: string;
}

// ---------------------------------------------------------------------------
// Rate Limiting Types
// ---------------------------------------------------------------------------
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// ---------------------------------------------------------------------------
// Extended socket with user data attached during handshake
// ---------------------------------------------------------------------------
interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      username: string;
      role: string;
      displayName: string;
    };
    isVisitor?: boolean;
    visitorId?: string;
  };
}

// ---------------------------------------------------------------------------
// Chat Gateway — Socket.io WebSocket handler
// ---------------------------------------------------------------------------
import { SiteConfigService } from '../config/site-config.service';

@WebSocketGateway({
  cors: {
    origin: async (origin: string, callback: (err: Error | null, allow?: boolean | string) => void) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost for development
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }

      try {
        // Using require() for Prisma - works with Bun due to Node compatibility
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const config = await prisma.siteConfig.findFirst({
          where: { isActive: true },
        });

        if (!config || !config.allowedOrigins) {
          return callback(new Error('CORS not configured in database'));
        }

        if (config.allowedOrigins === '*') {
          return callback(null, true);
        }

        const allowed = config.allowedOrigins.split(',').map((s: string) => s.trim());
        const isAllowed = allowed.some((allowedOrigin: string) => {
          return origin === allowedOrigin || origin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isAllowed) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } catch (err) {
        callback(new Error('CORS check failed'));
      }
    },
    credentials: true,
  },
  // Uncomment the following lines for Redis adapter (multi-instance scaling):
  // adapter: require('@socket.io/redis-adapter').createAdapter(
  //   require('redis').createClient({ url: process.env.REDIS_URL }),
  //   require('redis').createClient({ url: process.env.REDIS_URL }),
  // ),
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  
  // Rate limiter map: IP/VisitorID -> RateLimitInfo
  private rateLimits = new Map<string, RateLimitInfo>();

  // Inactivity Timers
  private inactivityWarnings = new Map<string, NodeJS.Timeout>();
  private inactivityResolves = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly uploadTokenService: UploadTokenService,
    private readonly siteConfigService: SiteConfigService,
    private readonly aiService: AiService,
    private readonly aiConfigService: AiConfigService,
    private readonly handoffService: HandoffService,
    private readonly securityService: AiSecurityService,
    private readonly toolRegistry: ToolRegistry,
    private readonly ragService: RagService,
    private readonly aiLogService: AiLogService,
  ) {
    // Register built-in tools
    this.toolRegistry.registerBuiltin(new SearchKnowledgeBaseTool(this.ragService));
    this.toolRegistry.registerBuiltin(new TransferToHumanTool());
    this.toolRegistry.registerBuiltin(new GetBusinessHoursTool());
  }

  /**
   * Internal Simple Rate Limiter
   * Allows 'limit' requests per 'ttl' milliseconds.
   */
  private isRateLimited(key: string, limit: number, ttl: number): boolean {
    const now = Date.now();
    const info = this.rateLimits.get(key);

    if (!info) {
      this.rateLimits.set(key, { count: 1, resetTime: now + ttl });
      return false;
    }

    if (now > info.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + ttl });
      return false;
    }

    if (info.count >= limit) {
      return true;
    }

    info.count++;
    return false;
  }

  // =========================================================================
  // INACTIVITY TIMERS
  // =========================================================================

  private resetInactivityTimer(conversationId: string) {
    this.clearInactivityTimer(conversationId);

    // Set 3 minute warning
    this.inactivityWarnings.set(conversationId, setTimeout(() => {
      this.server.to(`conv:${conversationId}`).emit('inactivity_warning', {
        conversationId,
        message: 'Chat will automatically close in 2 minutes due to inactivity.',
      });
    }, 3 * 60 * 1000));

    // Set 5 minute resolve
    this.inactivityResolves.set(conversationId, setTimeout(async () => {
      try {
        const conversation = await this.chatService.resolveConversation(conversationId, 'System (Inactivity)');
        
        // Notify the room
        this.server.to(`conv:${conversationId}`).emit('conversation_resolved', {
          conversationId,
          resolvedBy: 'System (Inactivity)',
        });
        
        // Push a final system message
        this.server.to(`conv:${conversationId}`).emit('inactivity_warning', {
          conversationId,
          message: 'Chat was closed due to inactivity.',
        });

        // Notify agents
        this.server.to('agents').emit('conversation_updated', { conversation });
        
        this.logger.log(`Conversation ${conversationId} resolved due to inactivity`);
      } catch (err) {
        this.logger.error(`Failed to auto-resolve ${conversationId}: ${err.message}`);
      }
      this.clearInactivityTimer(conversationId);
    }, 5 * 60 * 1000));
  }

  private clearInactivityTimer(conversationId: string) {
    if (this.inactivityWarnings.has(conversationId)) clearTimeout(this.inactivityWarnings.get(conversationId));
    if (this.inactivityResolves.has(conversationId)) clearTimeout(this.inactivityResolves.get(conversationId));
    this.inactivityWarnings.delete(conversationId);
    this.inactivityResolves.delete(conversationId);
  }

  // =========================================================================
  // CONNECTION LIFECYCLE
  // =========================================================================

  /**
   * Handles new socket connections. Authenticates agents via JWT Bearer token
   * in the handshake. Visitors connect without a token and are marked as
   * visitor sockets.
   */
  async handleConnection(client: AuthenticatedSocket) {
    let token = undefined;

    // Check if explicitly connecting as a visitor from the widget
    const isVisitorConnection = !!client.handshake.auth?.visitorId;

    if (!isVisitorConnection) {
      // Check cookie first (most secure)
      if (client.handshake.headers.cookie) {
        const match = client.handshake.headers.cookie.match(/omnichat_auth_token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }

      // Fallback to auth payload or header
      if (!token) {
        const fallbackToken = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
        if (fallbackToken && fallbackToken !== 'cookie-auth' && fallbackToken !== 'demo-token-123') {
          token = fallbackToken;
        }
      }
    }

    const origin = client.handshake.headers.origin as string;
    const referer = client.handshake.headers.referer as string;

    // Validate origin for visitor connections
    if (!token) {
      await this.validateVisitorOrigin(origin, referer);
    }

    if (token) {
      try {
        // Agent connection — validate JWT
        const user = await this.authService.validateToken(token);
        client.data.user = user;
        client.data.isVisitor = false;

        // Join global agents room for broadcasts
        client.join('agents');

        // Mark agent as online
        await this.chatService.setAgentOnline(user.id, true);

        // Broadcast updated presence to all connected agents
        const onlineAgents = await this.chatService.getOnlineAgents();
        this.server.to('agents').emit('agent_presence', { agents: onlineAgents });

        // Send conversation list and current user details to the newly connected agent immediately
        const conversations = await this.chatService.listConversations();
        client.emit('conversations_list', { 
          conversations,
          currentUser: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role
          }
        });

        this.logger.log(`Agent connected: ${user.displayName} (${client.id})`);
      } catch (error) {
        this.logger.warn(`Connection rejected: ${error.message}`);
        client.emit('error', { message: 'Authentication failed' });
        client.disconnect();
      }
    } else {
      // Visitor connection — no authentication required
      client.data.isVisitor = true;
      client.data.visitorId =
        (client.handshake.auth?.visitorId as string) || client.id;

      this.logger.log(
        `Visitor connected: ${client.data.visitorId} (${client.id})`,
      );
    }
  }

  /**
   * Validate visitor connection origin against allowed origins in database
   */
  private async validateVisitorOrigin(origin: string | undefined, referer: string | undefined): Promise<void> {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin && !referer) {
      return;
    }

    // Allow localhost for development
    if ((origin && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) ||
        (referer && (referer.startsWith('http://localhost') || referer.startsWith('http://127.0.0.1')))) {
      return;
    }

    try {
      // Using require() for Prisma - works with Bun due to Node compatibility
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const config = await prisma.siteConfig.findFirst({
        where: { isActive: true },
      });

      if (!config || !config.allowedOrigins) {
        throw new ForbiddenException('Origin validation not configured');
      }

      // Wildcard allows all origins
      if (config.allowedOrigins === '*') {
        return;
      }

      const allowedOrigins = config.allowedOrigins.split(',').map((s: string) => s.trim());

      // Validate origin header
      if (origin) {
        const isOriginAllowed = allowedOrigins.some((allowedOrigin: string) => {
          return origin === allowedOrigin ||
                 origin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isOriginAllowed) {
          return;
        }
      }

      // Fallback to referer validation
      if (referer) {
        const refererOrigin = new URL(referer).origin;
        const isRefererAllowed = allowedOrigins.some((allowedOrigin: string) => {
          return refererOrigin === allowedOrigin ||
                 refererOrigin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isRefererAllowed) {
          return;
        }
      }

      throw new ForbiddenException(`Origin not allowed: ${origin || referer}`);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Origin validation failed');
    }
  }

  /**
   * Handles socket disconnections. Updates agent online status when agents
   * disconnect.
   */
  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.data.user && !client.data.isVisitor) {
      // Check if this agent has other active sockets
      const agentSockets = await this.server
        .in(`agent:${client.data.user.id}`)
        .fetchSockets();

      // Only mark offline if no other sockets remain for this agent
      if (agentSockets.length === 0) {
        await this.chatService.setAgentOnline(client.data.user.id, false);

        const onlineAgents = await this.chatService.getOnlineAgents();
        this.server.to('agents').emit('agent_presence', { agents: onlineAgents });
      }

      this.logger.log(
        `Agent disconnected: ${client.data.user.displayName} (${client.id})`,
      );
    } else {
      this.logger.log(
        `Visitor disconnected: ${client.data.visitorId} (${client.id})`,
      );
    }
  }

  // =========================================================================
  // CONVERSATION EVENTS
  // =========================================================================

  /**
   * Start a new conversation (visitor-initiated).
   * Creates a Conversation record and auto-joins the visitor to the room.
   */
  @SubscribeMessage('start_conversation')
  async handleStartConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: StartConversationPayload,
  ) {
    const config = await this.siteConfigService.getActiveConfig() as any;
    if (config?.isOfflineMode) {
      client.emit('error', { message: 'All agents are currently offline. Please check back later.' });
      return;
    }

    const visitorId = payload.visitorId || client.data.visitorId || client.id;
    
    // Rate limit: 2 starts per 60 seconds
    const rlKey = `start:${client.handshake.address}:${visitorId}`;
    if (this.isRateLimited(rlKey, 2, 60000)) {
      client.emit('error', { message: 'Rate limit exceeded. Please wait before starting a new conversation.' });
      return;
    }

    // Combine any existing metadata with the new pre-chat form details
    const parsedMetadata = payload.metadata ? JSON.parse(payload.metadata) : {};
    if (payload.visitorName) parsedMetadata.visitorName = payload.visitorName;
    if (payload.visitorEmail) parsedMetadata.visitorEmail = payload.visitorEmail;

    // Extract IP and User-Agent
    const visitorIp = client.handshake.headers['x-forwarded-for']?.toString().split(',')[0] || client.handshake.address;
    const userAgentString = client.handshake.headers['user-agent'] || '';
    
    // Parse User-Agent
    const parser = new UAParser(userAgentString);
    const visitorBrowser = parser.getBrowser().name;
    const visitorOs = parser.getOS().name;
    const visitorDevice = parser.getDevice().type || 'Desktop';

    const conversation = await this.chatService.createConversation({
      visitorId,
      metadata: JSON.stringify(parsedMetadata),
      visitorIp,
      visitorBrowser,
      visitorOs,
      visitorDevice,
      visitorCurrentUrl: payload.visitorCurrentUrl,
      visitorTimezone: payload.visitorTimezone,
      visitorLanguage: payload.visitorLanguage,
      visitorScreenRes: payload.visitorScreenRes,
      visitorReferrer: payload.visitorReferrer,
      assignedUsername: payload.assignUsername,
    });

    // Join the visitor to the conversation room
    const roomName = `conv:${conversation.id}`;
    client.join(roomName);

    // Notify all agents of the new conversation
    this.server.to('agents').emit('new_conversation', { conversation });

    client.emit('conversation_started', { conversation });

    // Generate upload token for the visitor
    const uploadToken = await this.uploadTokenService.generateToken(conversation.id);
    client.emit('upload_token', { token: uploadToken });

    // Start inactivity timer
    this.resetInactivityTimer(conversation.id);

    // Initialize AI agent if enabled
    await this.initAiForConversation(conversation.id, client);

    this.logger.log(
      `Conversation started: ${conversation.id} by visitor ${visitorId}`,
    );

    return { conversationId: conversation.id };
  }

  /**
   * Initialize AI agent for a new conversation.
   * Sends greeting message if configured.
   */
  private async initAiForConversation(conversationId: string, client: AuthenticatedSocket) {
    try {
      const aiEnabled = await this.aiService.isEnabled();
      if (!aiEnabled) return;

      const agentConfig = await this.aiConfigService.getAgentConfig();
      if (!agentConfig?.enabled) return;

      // Initialize AI conversation state
      await this.handoffService.initConversation(conversationId);

      // Set conversation status to 'ai' so it appears under the AI tab in the admin dashboard
      const aiConv = await this.chatService.updateConversationStatus(conversationId, 'ai');
      this.server.to('agents').emit('conversation_updated', { conversation: aiConv });

      // Send AI greeting message if configured
      if (agentConfig.greetingMessage) {
        const greetingMsg = await this.chatService.createMessage({
          conversationId,
          senderType: 'ai',
          senderId: 'ai-agent',
          content: agentConfig.greetingMessage,
          messageType: 'text',
        });

        this.server.to(`conv:${conversationId}`).to('agents').emit('new_message', {
          message: {
            ...greetingMsg,
            senderDisplayName: 'AI Assistant',
          },
        });
      }
    } catch (error: any) {
      this.logger.error(`Failed to initialize AI for conversation ${conversationId}: ${error.message}`);
    }
  }

  /**
   * Join an existing conversation room.
   * Both visitors and agents call this to subscribe to conversation updates.
   */
  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: JoinConversationPayload,
  ) {
    const { conversationId } = payload;

    // Verify the conversation exists
    const conversation = await this.chatService.getConversation(conversationId);
    if (!conversation) {
      client.emit('error', { message: 'Conversation not found' });
      return;
    }

    const roomName = `conv:${conversationId}`;
    client.join(roomName);

    // If this is an agent joining, also join the agent-specific room for presence
    if (client.data.user) {
      client.join(`agent:${client.data.user.id}`);
    }

    // Send conversation history to the joining client
    client.emit('conversation_history', { conversation });

    // Provide upload token for visitor if conversation is still active
    if (client.data.isVisitor && conversation.status === 'active') {
      const uploadToken = await this.uploadTokenService.generateToken(conversationId);
      client.emit('upload_token', { token: uploadToken });
    }

    // Restart timer if conversation is still active
    if (conversation.status === 'active') {
      this.resetInactivityTimer(conversationId);
    }

    this.logger.log(
      `Socket ${client.id} joined room ${roomName}`,
    );
  }

  /**
   * Send a message within a conversation.
   * CRITICAL: Message is persisted BEFORE emitting to the room.
   * Failed writes do NOT emit — this is the persistence contract.
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const senderType = client.data.isVisitor ? 'visitor' : 'agent';
    
    const { conversationId, content, messageType, attachmentUrl, attachmentThumbnailUrl } = payload;

    // Rate Limit Check
    const rlKey = `msg:${client.id}`;
    if (this.isRateLimited(rlKey, 20, 10000)) { // 20 messages per 10 seconds
      client.emit('message_error', {
        conversationId,
        error: 'You are sending messages too quickly. Please slow down.',
      });
      return;
    }

    // Determine sender type and ID based on socket identity
    const senderId = client.data.isVisitor
      ? client.data.visitorId
      : client.data.user?.id;

    try {
      // PERSIST FIRST — this is the persistence contract.
      // The message is only emitted to the room after a successful DB write.
      const message = await this.chatService.createMessage({
        conversationId,
        senderType,
        senderId,
        content: content || '',
        messageType,
        attachmentUrl,
        attachmentThumbnailUrl,
      });

      // Emit to all clients in the conversation room AND all agents for dashboard preview updates
      this.server.to(`conv:${conversationId}`).to('agents').emit('new_message', {
        message: {
          ...message,
          senderDisplayName: client.data.user?.displayName ?? 'Visitor',
        },
      });

      // Reset the inactivity timer for this conversation
      this.resetInactivityTimer(conversationId);

      // If sender is visitor, trigger AI response (if enabled and not handed off)
      if (senderType === 'visitor') {
        this.handleAiResponse(conversationId, client).catch((err) => {
          this.logger.error(`AI response failed for ${conversationId}: ${err.message}`);
        });
      }
    } catch (error) {
      // Failed write — do NOT emit. Notify only the sender of the failure.
      this.logger.error(
        `Failed to persist message in ${conversationId}: ${error.message}`,
      );
      client.emit('message_error', {
        conversationId,
        error: 'Failed to send message. Please try again.',
      });
    }
  }

  // =========================================================================
  // MESSAGE & CONVERSATION ENHANCEMENTS (Read Receipts, Reviews)
  // =========================================================================

  @SubscribeMessage('read_message')
  async handleReadMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ReadMessagePayload,
  ) {
    try {
      const message = await this.chatService.markMessageAsRead(payload.messageId);
      
      // Notify the room that this message was read
      this.server.to(`conv:${payload.conversationId}`).emit('message_read', {
        messageId: payload.messageId,
        conversationId: payload.conversationId,
        readAt: message.readAt,
      });
    } catch (error) {
      this.logger.error(`Failed to mark message ${payload.messageId} as read: ${error.message}`);
    }
  }

  @SubscribeMessage('submit_review')
  async handleSubmitReview(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SubmitReviewPayload,
  ) {
    try {
      const conversation = await this.chatService.submitReview(
        payload.conversationId,
        payload.rating,
        payload.review,
      );

      this.server.to(`conv:${payload.conversationId}`).emit('review_submitted', {
        conversationId: payload.conversationId,
        rating: payload.rating,
        review: payload.review,
      });

      this.server.to('agents').emit('conversation_updated', { conversation });
    } catch (error) {
      this.logger.error(`Failed to submit review for ${payload.conversationId}: ${error.message}`);
    }
  }

  @SubscribeMessage('update_conversation_details')
  async handleUpdateConversationDetails(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: UpdateConversationDetailsPayload,
  ) {
    if (client.data.isVisitor || !client.data.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      const conversation = await this.chatService.updateConversationDetails(
        payload.conversationId,
        payload.assignedUsername,
        payload.agentRemarks,
      );

      // Notify all agents of the status change so they see the updated remarks/username
      this.server.emit('conversation_updated', { conversation });
    } catch (error) {
      this.logger.error(`Failed to update conversation details for ${payload.conversationId}: ${error.message}`);
      client.emit('error', { message: 'Failed to update details' });
    }
  }

  // =========================================================================
  // TYPING INDICATORS (no DB write — ephemeral events)
  // =========================================================================

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: TypingPayload,
  ) {
    const { conversationId } = payload;
    const eventName = client.data.isVisitor
      ? 'visitor_typing'
      : 'agent_typing';

    // Broadcast to others in the room (not the sender)
    client.to(`conv:${conversationId}`).emit(eventName, {
      conversationId,
      user: client.data.user?.displayName ?? 'Visitor',
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: TypingPayload,
  ) {
    const { conversationId } = payload;
    const eventName = client.data.isVisitor
      ? 'visitor_typing'
      : 'agent_typing';

    client.to(`conv:${conversationId}`).emit(eventName, {
      conversationId,
      user: client.data.user?.displayName ?? 'Visitor',
      isTyping: false,
    });
  }

  // =========================================================================
  // CONVERSATION MANAGEMENT
  // =========================================================================

  /**
   * Transfer conversation to a specialist.
   * Only agents should call this.
   */
  @SubscribeMessage('transfer_to_specialist')
  async handleTransferToSpecialist(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: TransferConversationPayload,
  ) {
    if (client.data.isVisitor || !client.data.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { conversationId, targetUsername } = payload;

    try {
      const conversation = await this.chatService.transferToSpecialist(
        conversationId,
        targetUsername,
      );

      // Notify all clients in the room
      this.server.to(`conv:${conversationId}`).emit('chat_transferred', {
        conversationId,
        specialistUsername: targetUsername,
        transferredBy: client.data.user.displayName,
      });

      // Notify all agents of the status change so dashboards update
      this.server.to('agents').emit('conversation_updated', { conversation });

      this.logger.log(
        `Conversation ${conversationId} transferred to ${targetUsername} by ${client.data.user.displayName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to transfer conversation ${conversationId}: ${error.message}`,
      );
      client.emit('error', { message: 'Failed to transfer conversation' });
    }
  }

  /**
   * Resolve (close) a conversation.
   * Only agents should call this.
   */
  @SubscribeMessage('resolve_conversation')
  async handleResolveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ResolveConversationPayload,
  ) {
    const { conversationId } = payload;

    const resolvedByUsername = client.data.isVisitor
      ? 'Visitor'
      : client.data.user?.username || 'Unknown';

    try {
      const conversation =
        await this.chatService.resolveConversation(conversationId, resolvedByUsername);

      this.clearInactivityTimer(conversationId);

      // Notify all clients in the room
      this.server.to(`conv:${conversationId}`).emit('conversation_resolved', {
        conversationId,
        resolvedBy: client.data.isVisitor ? 'Visitor' : (client.data.user?.displayName || 'Unknown'),
      });

      // Notify all agents of the status change
      this.server.to('agents').emit('conversation_updated', { conversation });

      this.logger.log(
        `Conversation ${conversationId} resolved by ${resolvedByUsername}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to resolve conversation ${conversationId}: ${error.message}`,
      );
      client.emit('error', { message: 'Failed to resolve conversation' });
    }
  }

  /**
   * List conversations — agent only.
   */
  @SubscribeMessage('list_conversations')
  async handleListConversations(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { status?: string },
  ) {
    if (client.data.isVisitor || !client.data.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const conversations = await this.chatService.listConversations(
      payload?.status,
    );
    client.emit('conversations_list', { 
      conversations,
      currentUser: {
        id: client.data.user.id,
        username: client.data.user.username,
        displayName: client.data.user.displayName,
        role: client.data.user.role
      }
    });
  }

  // =========================================================================
  // AI AGENT RESPONSE HANDLING
  // =========================================================================

  /**
   * Handle AI response for a visitor message.
   * Checks if AI is enabled, not handed off, and streams a response.
   */
  private async handleAiResponse(conversationId: string, client: AuthenticatedSocket) {
    try {
      // Check if AI is enabled
      const aiEnabled = await this.aiService.isEnabled();
      if (!aiEnabled) return;

      const agentConfig = await this.aiConfigService.getAgentConfig();
      if (!agentConfig?.enabled) return;

      // Check if conversation has a human agent assigned or is already handed off
      const conversation = await this.chatService.getConversation(conversationId);
      if (!conversation) return;
      if (conversation.agentId) return; // Human agent is handling
      
      const isAiHandling = await this.handoffService.isAiHandling(conversationId);
      if (!isAiHandling) return;

      // Security check on the last visitor message
      const lastVisitorMsg = conversation.messages
        ?.filter((m) => m.senderType === 'visitor')
        .pop();
      if (!lastVisitorMsg?.content) return;

      const visitorIp = conversation.visitorIp || 'unknown';
      const securityCheck = await this.securityService.checkMessage(
        conversationId,
        lastVisitorMsg.content,
        visitorIp,
        agentConfig.aiRateLimitPerMinute,
      );

      if (!securityCheck.allowed) {
        this.logger.warn(`AI security check failed for ${conversationId}: ${securityCheck.reason}`);
        return; // Silently skip AI response, human can still respond
      }

      // Check for human request keywords
      if (await this.handoffService.detectHumanRequest(lastVisitorMsg.content)) {
        const humanCheck = await this.handoffService.recordHumanRequest(
          conversationId,
          agentConfig.humanRequestThreshold,
        );
        if (humanCheck.shouldHandoff) {
          await this.triggerHandoff(conversationId, humanCheck.reason!);
          return;
        }
      }

      // Check turn limit
      const turnCheck = await this.handoffService.recordTurn(
        conversationId,
        agentConfig.maxTurnsPerConversation,
      );
      if (turnCheck.shouldHandoff) {
        await this.triggerHandoff(conversationId, turnCheck.reason!);
        return;
      }

      // Build message history for AI context
      const messages: CoreMessage[] = (conversation.messages || []).map((m) => ({
        role: m.senderType === 'visitor' ? 'user' as const : 'assistant' as const,
        content: m.content || '',
      }));

      // Get tools
      const tools = await this.toolRegistry.getTools({
        conversationId,
        visitorId: conversation.visitorId,
      });

      // Emit typing indicator
      this.server.to(`conv:${conversationId}`).emit('agent_typing', {
        conversationId,
        user: 'AI Assistant',
        isTyping: true,
      });

      // Stream AI response
      let fullText = '';
      let handoffTriggered = false;

      this.logger.log(`AI response starting for conversation ${conversationId}`);

      const onFinish = async ({ text, usage }: { text: string; usage: { totalTokens: number } }) => {
        this.logger.log(`[AI:${conversationId}] onFinish called. text length: ${text.length}, totalTokens: ${usage.totalTokens}, text preview: "${text.substring(0, 200)}"`);
        if (usage.totalTokens > 0) {
          const tokenCheck = await this.handoffService.recordTokenUsage(
            conversationId,
            usage.totalTokens,
            agentConfig.maxTokensPerSession,
          );
          if (tokenCheck.shouldHandoff) {
            handoffTriggered = true;
            await this.triggerHandoff(conversationId, tokenCheck.reason!);
          }
        }
        this.securityService.resetGlobalFailure();
      };

      let result: any;
      try {
        // First attempt: with tools
        const hasTools = Object.keys(tools).length > 0;
        this.logger.log(`Calling streamChat for ${conversationId} (hasTools=${hasTools})`);
        result = await this.aiService.streamChat({
          conversationId,
          messages,
          systemPrompt: agentConfig.systemPrompt,
          tools: hasTools ? tools : undefined,
          maxTokens: agentConfig.maxTokensPerResponse,
          temperature: agentConfig.temperature,
          onFinish,
        });

        // Consume stream: emit text deltas to visitor; on errors record to DB
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            fullText += part.textDelta;
            this.server.to(`conv:${conversationId}`).emit('ai_stream', {
              conversationId,
              token: part.textDelta,
              isComplete: false,
            });
          } else if (part.type === 'error') {
            // Record stream error to DB
            await this.aiLogService.createLog({
              conversationId,
              providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
              eventType: 'stream_error',
              message: part.error?.message || 'stream_error',
              details: part.error || part,
            });
            this.logger.error(`AI stream error for ${conversationId}: ${part.error?.message ?? 'unknown'}`);
          }
        }
      } catch (toolError: any) {
        // Retry without tools — some providers don't support tool calling
        // Record tool error and retry without tools
        await this.aiLogService.createLog({
          conversationId,
          providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
          eventType: 'tool_error',
          message: toolError.message,
          details: toolError.stack || toolError,
        });
        this.logger.warn(`Streaming with tools failed for ${conversationId}, retrying without tools`);
        fullText = '';

        result = await this.aiService.streamChat({
          conversationId,
          messages,
          systemPrompt: agentConfig.systemPrompt,
          maxTokens: agentConfig.maxTokensPerResponse,
          temperature: agentConfig.temperature,
          onFinish,
        });

        // Consume retry stream and emit text deltas
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            fullText += part.textDelta;
            this.server.to(`conv:${conversationId}`).emit('ai_stream', {
              conversationId,
              token: part.textDelta,
              isComplete: false,
            });
          } else if (part.type === 'error') {
            await this.aiLogService.createLog({
              conversationId,
              providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
              eventType: 'stream_error_retry',
              message: part.error?.message || 'stream_error',
              details: part.error || part,
            });
            this.logger.error(`AI retry stream error for ${conversationId}: ${part.error?.message ?? 'unknown'}`);
          }
        }
      }

      // Stop typing indicator
      this.server.to(`conv:${conversationId}`).emit('agent_typing', {
        conversationId,
        user: 'AI Assistant',
        isTyping: false,
      });

      // Check tool results for handoff or RAG failures
      let toolResults: any;
      try {
        toolResults = await result.toolResults;
        // Persist toolResults as a debug log entry if any tool failed
        if (toolResults && toolResults.length > 0) {
          await this.aiLogService.createLog({
            conversationId,
            providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
            eventType: 'tool_results',
            message: 'tool_results_received',
            details: toolResults,
          });
        }
      } catch (trError: any) {
        await this.aiLogService.createLog({
          conversationId,
          providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
          eventType: 'tool_results_error',
          message: trError.message,
          details: trError.stack || trError,
        });
        this.logger.warn(`Error reading toolResults for ${conversationId}: ${trError.message}`);
        toolResults = [];
      }
      if (Array.isArray(toolResults)) {
        for (const tr of toolResults) {
          const toolResult = tr as any;
          // Check for transfer_to_human tool call
          if (toolResult?.toolName === 'transfer_to_human') {
            const reason = toolResult?.result?.reason || 'AI initiated transfer';
            await this.triggerHandoff(conversationId, reason);
            handoffTriggered = true;
          }
          // Check for RAG failures
          if (toolResult?.toolName === 'search_knowledge_base') {
            const ragResult = toolResult?.result;
            if (ragResult && !ragResult.found) {
              const ragCheck = await this.handoffService.recordRagFailure(
                conversationId,
                agentConfig.ragFailureThreshold,
              );
              if (ragCheck.shouldHandoff) {
                await this.triggerHandoff(conversationId, ragCheck.reason!);
                handoffTriggered = true;
              }
            } else {
              await this.handoffService.resetRagFailure(conversationId);
            }
          }
        }
      }

      // Persist the AI message
      if (fullText.trim()) {
        this.logger.log(`Persisting AI message for ${conversationId}`);
        const aiMessage = await this.chatService.createMessage({
          conversationId,
          senderType: 'ai',
          senderId: 'ai-agent',
          content: fullText,
          messageType: 'text',
        });

        // Emit complete message
        this.server.to(`conv:${conversationId}`).to('agents').emit('new_message', {
          message: {
            ...aiMessage,
            senderDisplayName: 'AI Assistant',
          },
        });

        // Signal stream completion
        this.server.to(`conv:${conversationId}`).emit('ai_stream', {
          conversationId,
          token: '',
          isComplete: true,
          fullText,
        });
      } else {
        await this.aiLogService.createLog({
          conversationId,
          providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
          eventType: 'empty_response',
          message: 'fullText empty after streaming',
          details: { fullTextLength: fullText.length },
        });

        // Stop typing indicator since we have nothing to show
        this.server.to(`conv:${conversationId}`).emit('agent_typing', {
          conversationId,
          user: 'AI Assistant',
          isTyping: false,
        });

        // Send a visible error so the visitor isn't left hanging
        const emptyMsg = await this.chatService.createMessage({
          conversationId,
          senderType: 'system',
          senderId: 'system',
          content: 'Sorry, I was unable to generate a response. Please try again.',
          messageType: 'text',
        });
        this.server.to(`conv:${conversationId}`).emit('new_message', { message: emptyMsg });
      }

    } catch (error: any) {
      await this.aiLogService.createLog({
        conversationId,
        providerId: (await this.aiConfigService.getActiveProvider())?.id || null,
        eventType: 'response_exception',
        message: error.message,
        details: error.stack || error,
      });
      this.securityService.recordGlobalFailure();
      this.logger.error(`AI response error for ${conversationId}: ${error.message}`);

      // Stop typing indicator on error
      this.server.to(`conv:${conversationId}`).emit('agent_typing', {
        conversationId,
        user: 'AI Assistant',
        isTyping: false,
      });

      // Send a visible error message to the visitor so they're not left hanging
      const errorMsg = await this.chatService.createMessage({
        conversationId,
        senderType: 'system',
        senderId: 'system',
        content: 'Sorry, I encountered an issue processing your request. Please try again or a human agent will assist you shortly.',
        messageType: 'text',
      });
      this.server.to(`conv:${conversationId}`).emit('new_message', { message: errorMsg });

      // Record failure and check for handoff
      const failureResult = await this.handoffService.recordAiFailure(conversationId);
      if (failureResult.shouldHandoff) {
        await this.triggerHandoff(conversationId, failureResult.reason!);
      }

      // Check for credit/quota errors
      if (error.status === 402 || error.status === 429 || 
          error.message?.includes('quota') || error.message?.includes('credit')) {
        await this.triggerHandoff(conversationId, 'AI provider credit/quota exhausted');
      }
    }
  }

  /**
   * Trigger a handoff to human agents.
   * Persists state, sends system message, notifies agents.
   */
  private async triggerHandoff(conversationId: string, reason: string) {
    await this.handoffService.executeHandoff(conversationId, reason);

    // Move conversation from AI tab to active (human) tab
    const updatedConv = await this.chatService.updateConversationStatus(conversationId, 'active');

    // Notify agents so the conversation moves from AI tab to Active tab
    this.server.to('agents').emit('conversation_updated', { conversation: updatedConv });

    // Send system message
    const systemMsg = await this.chatService.createMessage({
      conversationId,
      senderType: 'system',
      senderId: 'system',
      content: 'Transferring you to a human agent. Please wait...',
      messageType: 'text',
    });

    this.server.to(`conv:${conversationId}`).to('agents').emit('new_message', {
      message: {
        ...systemMsg,
        senderDisplayName: 'System',
      },
    });

    // Notify all agents of the handoff
    this.server.to('agents').emit('ai_handoff', {
      conversationId,
      reason,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`AI handoff triggered for ${conversationId}: ${reason}`);
  }
}
