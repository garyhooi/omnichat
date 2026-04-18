import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuickReplyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.quickReply.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(title: string, content: string) {
    // Validation: title and content length limits
    if ((title || '').trim().length === 0) throw new BadRequestException('Title is required');
    if (title.length > 200) throw new BadRequestException('Title is too long (max 200 characters)');
    if (content.length > 1000) throw new BadRequestException('Content is too long (max 1000 characters)');

    return this.prisma.quickReply.create({
      data: { title, content },
    });
  }

  async update(id: string, title: string, content: string) {
    if ((title || '').trim().length === 0) throw new BadRequestException('Title is required');
    if (title.length > 200) throw new BadRequestException('Title is too long (max 200 characters)');
    if (content.length > 1000) throw new BadRequestException('Content is too long (max 1000 characters)');

    return this.prisma.quickReply.update({
      where: { id },
      data: { title, content },
    });
  }

  async remove(id: string) {
    return this.prisma.quickReply.delete({
      where: { id },
    });
  }
}
