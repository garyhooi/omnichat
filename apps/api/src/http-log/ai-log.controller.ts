import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('logs/ai')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AiLogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('eventType') eventType?: string,
    @Query('search') search?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = Math.min(limit ? parseInt(limit, 10) : 50, 100);
    const skip = (p - 1) * l;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (eventType) {
      where.eventType = eventType;
    }

    if (search) {
      where.message = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      (this.prisma as any)['aiLog'].findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: l,
      }),
      (this.prisma as any)['aiLog'].count({ where }),
    ]);

    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }
}
