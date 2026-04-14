import { Injectable } from '@nestjs/common';
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
    return this.prisma.quickReply.create({
      data: { title, content },
    });
  }

  async update(id: string, title: string, content: string) {
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
