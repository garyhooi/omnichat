import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadTokenService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new upload token for a conversation
   * Tokens are valid for 15 minutes by default
   */
  async generateToken(conversationId: string, ttlMinutes: number = 15): Promise<string> {
    // Verify conversation exists
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check for existing unused token
    const existingToken = await this.prisma.uploadToken.findFirst({
      where: {
        conversationId,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingToken) {
      return existingToken.token;
    }

    // Generate new token
    const token = `upload_${randomUUID()}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

    await this.prisma.uploadToken.create({
      data: {
        token,
        conversationId,
        expiresAt,
      },
    });

    return token;
  }

  /**
   * Validate an upload token
   * Returns the conversation ID if valid, throws exception otherwise
   */
  async validateToken(token: string): Promise<string> {
    const uploadToken = await this.prisma.uploadToken.findUnique({
      where: { token },
    });

    if (!uploadToken) {
      throw new ForbiddenException('Invalid upload token');
    }

    if (uploadToken.used) {
      throw new ForbiddenException('Upload token already used');
    }

    if (uploadToken.expiresAt < new Date()) {
      throw new ForbiddenException('Upload token expired');
    }

    return uploadToken.conversationId;
  }

  /**
   * Mark a token as used after successful upload
   */
  async markTokenAsUsed(token: string): Promise<void> {
    await this.prisma.uploadToken.update({
      where: { token },
      data: { used: true },
    });
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.uploadToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  /**
   * Clean up used tokens (should be run periodically)
   */
  async cleanupUsedTokens(): Promise<number> {
    const result = await this.prisma.uploadToken.deleteMany({
      where: {
        used: true,
        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24 hours ago
      },
    });

    return result.count;
  }
}