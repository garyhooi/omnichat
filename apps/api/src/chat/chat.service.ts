import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sanitizeHtml from 'sanitize-html';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CreateMessageInput {
  conversationId: string;
  senderType: 'visitor' | 'agent';
  senderId?: string;
  content?: string;
  messageType?: string;
  attachmentUrl?: string;
  attachmentThumbnailUrl?: string;
}

export interface CreateConversationInput {
  visitorId: string;
  metadata?: string;
  visitorIp?: string;
  visitorBrowser?: string;
  visitorOs?: string;
  visitorDevice?: string;
  visitorCurrentUrl?: string;
  visitorTimezone?: string;
  visitorLanguage?: string;
  visitorScreenRes?: string;
  visitorReferrer?: string;
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
        visitorIp: input.visitorIp ?? null,
        visitorBrowser: input.visitorBrowser ?? null,
        visitorOs: input.visitorOs ?? null,
        visitorDevice: input.visitorDevice ?? null,
        visitorCurrentUrl: input.visitorCurrentUrl ?? null,
        visitorTimezone: input.visitorTimezone ?? null,
        visitorLanguage: input.visitorLanguage ?? null,
        visitorScreenRes: input.visitorScreenRes ?? null,
        visitorReferrer: input.visitorReferrer ?? null,
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
            username: true,
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
        _count: {
          select: {
            messages: {
              where: {
                senderType: 'visitor',
                readAt: null,
              },
            },
          },
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
    const cleanContent = input.content ? sanitizeHtml(input.content, {
      allowedTags: [], // Strip all HTML tags
      allowedAttributes: {},
    }) : null;

    const message = await this.prisma.message.create({
      data: {
        conversationId: input.conversationId,
        senderType: input.senderType,
        senderId: input.senderId ?? null,
        messageType: input.messageType ?? 'text',
        content: cleanContent,
        attachmentUrl: input.attachmentUrl ?? null,
        attachmentThumbnailUrl: input.attachmentThumbnailUrl ?? null,
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
        username: true,
        role: true,
        isOnline: true,
      },
    });
  }

  /**
   * Mark a message as read by setting the readAt timestamp.
   */
  async markMessageAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  /**
   * Submit a review for a resolved conversation.
   */
  async submitReview(conversationId: string, rating: number, review?: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        rating,
        review: review || null,
        status: 'resolved', // Ensure it's resolved if not already
      },
    });
  }

  /**
   * Update internal agent remarks and assigned username for a conversation.
   */
  async updateConversationDetails(conversationId: string, assignedUsername?: string, agentRemarks?: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        assignedUsername,
        agentRemarks,
      },
    });
  }

  /**
   * Update visitor details (e.g. from pre-chat form).
   */
  async updateConversationMetadata(conversationId: string, metadata: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { metadata },
    });
  }
}

