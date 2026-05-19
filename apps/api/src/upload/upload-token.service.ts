import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async generateToken(conversationId: string, ttlMinutes: number = 15): Promise<string> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

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

    const token = `upload_${randomUUID()}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

    await this.prisma.uploadToken.create({
      data: { token, conversationId, expiresAt },
    });

    return token;
  }

  async validateToken(token: string): Promise<{ conversationId: string; token: string }> {
    const uploadToken = await this.prisma.uploadToken.findUnique({
      where: { token },
    });

    if (!uploadToken) {
      throw new ForbiddenException('Invalid upload token');
    }

    if (uploadToken.expiresAt < new Date()) {
      throw new ForbiddenException('Upload token expired');
    }

    if (uploadToken.used) {
      throw new ForbiddenException('Upload token already used');
    }

    return { conversationId: uploadToken.conversationId, token: uploadToken.token };
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await this.prisma.uploadToken.update({
      where: { token },
      data: { used: true },
    });
  }
}