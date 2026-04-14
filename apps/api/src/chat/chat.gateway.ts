import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

// ---------------------------------------------------------------------------
// Types for inbound/outbound events
// ---------------------------------------------------------------------------
interface JoinConversationPayload {
  conversationId: string;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
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
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
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

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

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

    if (token) {
      try {
        // Agent connection — validate JWT
        const user = await this.authService.validateToken(token);
        client.data.user = user;
        client.data.isVisitor = false;

        // Mark agent as online
        await this.chatService.setAgentOnline(user.id, true);

        // Broadcast updated presence to all connected clients
        const onlineAgents = await this.chatService.getOnlineAgents();
        this.server.emit('agent_presence', { agents: onlineAgents });

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
        this.server.emit('agent_presence', { agents: onlineAgents });
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

    const conversation = await this.chatService.createConversation({
      visitorId,
      metadata: payload.metadata,
    });

    // Join the visitor to the conversation room
    const roomName = `conv:${conversation.id}`;
    client.join(roomName);

    // Notify all agents of the new conversation
    this.server.emit('new_conversation', { conversation });

    client.emit('conversation_started', { conversation });

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
    const { conversationId, content } = payload;

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
        content,
      });

      // Emit to all clients in the conversation room (including sender)
      this.server.to(`conv:${conversationId}`).emit('new_message', {
        message: {
          ...message,
          senderDisplayName: client.data.user?.displayName ?? 'Visitor',
        },
      });
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

      // Notify all clients in the room
      this.server.to(`conv:${conversationId}`).emit('conversation_resolved', {
        conversationId,
        resolvedBy: client.data.user.displayName,
      });

      // Notify all agents of the status change
      this.server.emit('conversation_updated', { conversation });

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
