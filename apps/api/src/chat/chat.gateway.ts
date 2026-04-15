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
  ) {}

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
        const conversation = await this.chatService.resolveConversation(conversationId);
        
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
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

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

        // Send conversation list to the newly connected agent immediately
        const conversations = await this.chatService.listConversations();
        client.emit('conversations_list', { conversations });

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

    this.logger.log(
      `Conversation started: ${conversation.id} by visitor ${visitorId}`,
    );

    return { conversationId: conversation.id };
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
    const senderType = client.data.isVisitor ? 'visitor' : 'agent';
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
   * Resolve (close) a conversation.
   * Only agents should call this.
   */
  @SubscribeMessage('resolve_conversation')
  async handleResolveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: ResolveConversationPayload,
  ) {
    // Only authenticated agents can resolve conversations
    if (client.data.isVisitor || !client.data.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { conversationId } = payload;

    try {
      const conversation =
        await this.chatService.resolveConversation(conversationId);

      this.clearInactivityTimer(conversationId);

      // Notify all clients in the room
      this.server.to(`conv:${conversationId}`).emit('conversation_resolved', {
        conversationId,
        resolvedBy: client.data.user.displayName,
      });

      // Notify all agents of the status change
      this.server.to('agents').emit('conversation_updated', { conversation });

      this.logger.log(
        `Conversation ${conversationId} resolved by ${client.data.user.displayName}`,
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
    client.emit('conversations_list', { conversations });
  }
}
