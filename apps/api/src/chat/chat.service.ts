import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sanitizeHtml from 'sanitize-html';

export interface CreateMessageInput {
  conversationId: string;
  senderType: 'visitor' | 'agent' | 'ai' | 'system';
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
  assignedUsername?: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Create a new conversation for a visitor. */
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
        assignedUsername: input.assignedUsername ?? null,
      },
    });

    this.logger.log(`Conversation created: ${conversation.id}`);
    return conversation;
  }

  /** Retrieve a conversation by ID with its messages. */
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

  /** List conversations with optional status filter. */
  /**
   * How much transcript a conversation open returns. Older messages are fetched
   * on demand with getMessagePage(), so opening a long-running conversation
   * costs one bounded query instead of its entire history.
   */
  static readonly HISTORY_PAGE_SIZE = 200;

  /**
   * A conversation plus its MOST RECENT messages (returned oldest-first, ready
   * to render) and whether older messages exist. Used when a console opens a
   * conversation; the AI pipeline keeps using getConversation() for full context.
   */
  async getConversationPage(conversationId: string, limit = ChatService.HISTORY_PAGE_SIZE) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        agent: { select: { id: true, displayName: true, username: true, isOnline: true } },
      },
    });
    if (!conversation) return null;

    const page = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });
    const hasMoreMessages = page.length > limit;
    return {
      ...conversation,
      messages: (hasMoreMessages ? page.slice(0, limit) : page).reverse(),
      hasMoreMessages,
    };
  }

  /**
   * One page of transcript OLDER than `before` (exclusive), oldest-first.
   * Backed by the [conversationId, createdAt] index.
   */
  async getMessagePage(conversationId: string, before: string, limit = ChatService.HISTORY_PAGE_SIZE) {
    const beforeDate = new Date(before);
    if (Number.isNaN(beforeDate.getTime())) return { messages: [], hasMoreMessages: false };

    const page = await this.prisma.message.findMany({
      where: { conversationId, createdAt: { lt: beforeDate } },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });
    const hasMoreMessages = page.length > limit;
    return {
      messages: (hasMoreMessages ? page.slice(0, limit) : page).reverse(),
      hasMoreMessages,
    };
  }

  /**
   * Ownership probe for send-path validation — loads just the two fields the
   * caller needs instead of the whole transcript.
   */
  async getConversationOwnership(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { visitorId: true, visitorIp: true },
    });
  }

  /** Parse a "YYYY-MM-DD" (local-time) string into a Date at that day's start. */
  private parseDayStart(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  }

  /** Parse a "YYYY-MM-DD" (local-time) string into the last millisecond of that day. */
  private parseDayEnd(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
  }

  /**
   * Upper bound on a single conversation-list response. The query costs two
   * index lookups PER ROW (latest message + unread count), so an unbounded
   * window made the Resolved tab slower and slower as history accumulated.
   * Active/AI/specialist conversations are the most recently updated, so they
   * are never the rows this cuts.
   */
  static readonly MAX_CONVERSATIONS = 300;

  /**
   * Newest-first conversation list. One extra row is fetched purely to detect
   * truncation, so callers can tell the operator the list is capped instead of
   * silently presenting the cap as the whole set.
   */
  async listConversations(status?: string, dateRange?: { start?: string; end?: string }) {
    const updatedAt: Record<string, Date> | undefined =
      dateRange?.start || dateRange?.end
        ? {
            ...(dateRange.start ? { gte: this.parseDayStart(dateRange.start) } : {}),
            ...(dateRange.end ? { lte: this.parseDayEnd(dateRange.end) } : {}),
          }
        : undefined;

    const rows = await this.prisma.conversation.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(updatedAt ? { updatedAt } : {}),
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
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
      take: ChatService.MAX_CONVERSATIONS + 1,
    });

    const truncated = rows.length > ChatService.MAX_CONVERSATIONS;
    return {
      conversations: truncated ? rows.slice(0, ChatService.MAX_CONVERSATIONS) : rows,
      truncated,
    };
  }

  /** Persist a new message. Gateway MUST call this before emitting to the room. */
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

    await this.prisma.conversation.update({
      where: { id: input.conversationId },
      data: { updatedAt: new Date() },
    });

    this.logger.log(
      `Message ${message.id} persisted in conversation ${input.conversationId}`,
    );
    return message;
  }

  /** Transfer conversation to a specialist. */
  async transferToSpecialist(conversationId: string, specialistUsername: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        status: 'specialist',
        specialistUsername 
      },
    });
  }

  /** Resolve a conversation. */
  async resolveConversation(conversationId: string, resolvedByUsername?: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        status: 'resolved',
        resolvedByUsername
      },
    });
  }

  /** Update the status of a conversation. */
  async updateConversationStatus(conversationId: string, status: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }

  /** Assign an agent to a conversation. */
  async assignAgent(conversationId: string, agentId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { agentId },
    });
  }

  /** Update an agent's online presence state. */
  async setAgentOnline(agentId: string, isOnline: boolean) {
    return this.prisma.adminUser.update({
      where: { id: agentId },
      data: {
        isOnline,
        lastSeenAt: new Date(),
      },
    });
  }

  /** Get all online agents. */
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

  /** Mark a message as read. */
  async markMessageAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  /** Submit a review for a resolved conversation. */
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

  /** Update conversation details (remarks, assigned username). */
  async updateConversationDetails(conversationId: string, assignedUsername?: string, agentRemarks?: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        assignedUsername,
        agentRemarks,
      },
    });
  }

  /** Update visitor metadata (e.g. from pre-chat form). */
  async updateConversationMetadata(conversationId: string, metadata: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { metadata },
    });
  }
}

