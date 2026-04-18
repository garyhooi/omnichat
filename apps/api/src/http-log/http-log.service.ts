import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HttpLogService {
  private readonly logger = new Logger(HttpLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: {
    method: string;
    url: string;
    statusCode?: number;
    clientIp?: string;
    userAgent?: string;
    userId?: string;
    username?: string;
    requestHeaders?: string;
    requestBody?: string;
    responseBody?: string;
    contentLength?: number;
    duration?: number;
  }) {
    try {
      return (this.prisma as any)['httpLog'].create({ data });
    } catch (err) {
      this.logger.error(`Failed to write HTTP log: ${err.message}`);
      return null;
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    method?: string;
    statusCode?: number;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    if (params.method) {
      where.method = params.method;
    }

    if (params.statusCode) {
      where.statusCode = params.statusCode;
    }

    if (params.search) {
      where.url = { contains: params.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      (this.prisma as any)['httpLog'].findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (this.prisma as any)['httpLog'].count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
