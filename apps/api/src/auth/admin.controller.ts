import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AdminIpAllowlistGuard } from './admin-ip-allowlist.guard';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { IsBoolean, IsOptional, IsString } from 'class-validator';


class UpdateUserDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}


@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('users')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  async getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('online') online?: string,
  ) {
    const where: any = {};
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        { displayName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      );
    }

    if (role) {
      where.role = role;
    }

    if (conditions.length > 0) {
      where.OR = conditions;
    }

    const users = await this.prisma.adminUser.findMany({
      where,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isOnline: true,
        isLocked: true,
        lastSeenAt: true,
        lastLoginIp: true,
        userAgent: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const usersWithSessionCount = await Promise.all(
      users.map(async (user) => {
        const activeSessions = await this.prisma.session.count({
          where: {
            adminUserId: user.id,
            revoked: false,
            expiresAt: { gt: now },
          },
        });
        const effectiveOnline = user.isOnline && activeSessions > 0;
        return { ...user, activeSessions, effectiveOnline };
      }),
    );

    if (online === 'true') {
      return usersWithSessionCount.filter((u) => u.effectiveOnline);
    } else if (online === 'false') {
      return usersWithSessionCount.filter((u) => !u.effectiveOnline);
    }

    return usersWithSessionCount;
  }

  @Patch('users/:id')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'developer')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (dto.role === 'developer' && req.user?.role !== 'developer') {
      throw new ForbiddenException('Only developers can promote users to developer role');
    }

    const data: any = {};
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isLocked !== undefined) data.isLocked = dto.isLocked;

    const user = await this.prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isOnline: true,
        isLocked: true,
      },
    });

    if (dto.isLocked === true) {
      await this.prisma.session.updateMany({
        where: {
          adminUserId: id,
          revoked: false,
        },
        data: { revoked: true },
      });
    }

    return user;
  }

  @Delete('users/:id/sessions')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'developer')
  async forceLogoutUser(@Param('id') id: string) {
    const result = await this.prisma.session.updateMany({
      where: {
        adminUserId: id,
        revoked: false,
      },
      data: { revoked: true },
    });
    return { success: true, revokedCount: result.count };
  }
}
