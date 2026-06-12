import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolLogService {
  private readonly logger = new Logger(ToolLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: {
    toolName: string;
    handlerType: string;
    conversationId?: string | null;
    requestUrl?: string | null;
    requestMethod?: string | null;
    requestHeaders?: string | null;
    requestBody?: string | null;
    responseStatus?: number | null;
    responseBody?: string | null;
    duration?: number | null;
    success?: boolean;
    errorMessage?: string | null;
  }) {
    try {
      const prisma = this.prisma as any;
      return prisma.toolLog.create({
        data: {
          toolName: data.toolName,
          handlerType: data.handlerType,
          conversationId: data.conversationId || null,
          requestUrl: data.requestUrl || null,
          requestMethod: data.requestMethod || null,
          requestHeaders: data.requestHeaders || null,
          requestBody: data.requestBody || null,
          responseStatus: data.responseStatus || null,
          responseBody: data.responseBody || null,
          duration: data.duration || null,
          success: data.success ?? true,
          errorMessage: data.errorMessage || null,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to write tool log: ${err.message}`);
      return null;
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    toolName?: string;
    handlerType?: string;
    success?: string;
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

    if (params.toolName) {
      where.toolName = params.toolName;
    }

    if (params.handlerType) {
      where.handlerType = params.handlerType;
    }

    if (params.success !== undefined && params.success !== '') {
      where.success = params.success === 'true';
    }

    if (params.search) {
      where.toolName = { contains: params.search, mode: 'insensitive' };
    }

    const prisma = this.prisma as any;
    const [data, total] = await Promise.all([
      prisma.toolLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.toolLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
