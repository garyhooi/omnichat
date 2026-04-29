import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AdminIpAllowlistGuard } from './admin-ip-allowlist.guard';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------
class UpdateUserDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * List / search users with fuzzy matching on displayName, username, and role.
   * Admin only.
   */
  @Get('users')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  async getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('online') online?: string,
  ) {
    const where: any = {};
    const conditions: any[] = [];

    // Fuzzy search — matches displayName OR username (case-insensitive contains)
    if (search) {
      conditions.push(
        { displayName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      );
    }

    // Role filter
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

    // For each user, count active sessions and compute effective online status
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
        // Effective online: must have isOnline=true AND at least one valid session
        const effectiveOnline = user.isOnline && activeSessions > 0;
        return { ...user, activeSessions, effectiveOnline };
      }),
    );

    // Apply online/offline filter on effective status
    if (online === 'true') {
      return usersWithSessionCount.filter((u) => u.effectiveOnline);
    } else if (online === 'false') {
      return usersWithSessionCount.filter((u) => !u.effectiveOnline);
    }

    return usersWithSessionCount;
  }

  /**
   * Update user role or lock status. Admin only.
   */
  @Patch('users/:id')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
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

    // If user was locked, revoke all their active sessions immediately
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

  /**
   * Force logout a user — revokes ALL their active sessions. Admin only.
   */
  @Delete('users/:id/sessions')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
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
