import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CreateMessageInput {
  conversationId: string;
  senderType: 'visitor' | 'agent';
  senderId?: string;
  content: string;
}

export interface CreateConversationInput {
  visitorId: string;
  metadata?: string;
}

// ---------------------------------------------------------------------------
// Service — Prisma persistence layer for chat operations
// ---------------------------------------------------------------------------
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new conversation for a visitor.
   */
  async createConversation(input: CreateConversationInput) {
    const conversation = await this.prisma.conversation.create({
      data: {
        visitorId: input.visitorId,
        status: 'active',
        metadata: input.metadata ?? null,
      },
    });

    this.logger.log(`Conversation created: ${conversation.id}`);
    return conversation;
  }

  /**
   * Retrieve a conversation by ID with its messages.
   */
  async getConversation(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        agent: {
          select: {
            id: true,
            displayName: true,
            email: true,
            isOnline: true,
          },
        },
      },
    });
  }

  /**
   * List conversations with optional status filter.
   */
  async listConversations(status?: string) {
    return this.prisma.conversation.findMany({
      where: status ? { status } : undefined,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Only the latest message for preview
        },
        agent: {
          select: { id: true, displayName: true, isOnline: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Persist a new message. This is the ONLY method that writes messages to
   * the database. The gateway MUST call this before emitting to the room.
   */
  async createMessage(input: CreateMessageInput) {
    const message = await this.prisma.message.create({
      data: {
        conversationId: input.conversationId,
        senderType: input.senderType,
        senderId: input.senderId ?? null,
        content: input.content,
      },
    });

    // Touch the conversation's updatedAt
    await this.prisma.conversation.update({
      where: { id: input.conversationId },
      data: { updatedAt: new Date() },
    });

    this.logger.log(
      `Message ${message.id} persisted in conversation ${input.conversationId}`,
    );
    return message;
  }

  /**
   * Resolve a conversation — marks it as closed.
   */
  async resolveConversation(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'resolved' },
    });
  }

  /**
   * Assign an agent to a conversation.
   */
  async assignAgent(conversationId: string, agentId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { agentId },
    });
  }

  /**
   * Update an agent's online presence state.
   */
  async setAgentOnline(agentId: string, isOnline: boolean) {
    return this.prisma.adminUser.update({
      where: { id: agentId },
      data: {
        isOnline,
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Get all online agents.
   */
  async getOnlineAgents() {
    return this.prisma.adminUser.findMany({
      where: { isOnline: true },
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
        isOnline: true,
      },
    });
  }
}
