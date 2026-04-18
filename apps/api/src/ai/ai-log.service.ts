import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiLogService {
  private readonly logger = new Logger(AiLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: {
    conversationId?: string | null;
    providerId?: string | null;
    eventType: string;
    message?: string | null;
    details?: any;
  }) {
    try {
      const detailsStr = data.details ? JSON.stringify(data.details) : null;
      // Use index access to avoid TypeScript errors when Prisma client types are not regenerated
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (this.prisma as any)['aiLog'].create({
        data: {
          conversationId: data.conversationId || null,
          providerId: data.providerId || null,
          eventType: data.eventType,
          message: data.message || null,
          details: detailsStr,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to write AI log: ${err.message}`);
      return null;
    }
  }
}
