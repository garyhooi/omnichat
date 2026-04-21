import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SiteConfigService } from './site-config.service';
import { PrismaService } from '../prisma/prisma.service';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';

type AuthenticatedRequest = {
  user?: {
    role?: string;
  };
};

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------
class CreateSiteConfigDto {
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @IsString()
  @IsOptional()
  bubbleColor?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  offlineMessage?: string;

  @IsString()
  @IsOptional()
  bubbleSize?: string;

  @IsString()
  @IsOptional()
  bubblePattern?: string;

  @IsString()
  @IsOptional()
  websitePosition?: string;

  @IsString()
  @IsOptional()
  bubbleIcon?: string;

  @IsString()
  @IsOptional()
  notificationSoundUrl?: string;

  @IsString()
  @IsNotEmpty()
  allowedOrigins: string;

  @IsString()
  @IsOptional()
  adminAllowedIps?: string;

  @IsBoolean()
  @IsOptional()
  enableReadReceipts?: boolean;

  @IsBoolean()
  @IsOptional()
  isOfflineMode?: boolean;
}

class UpdateSiteConfigDto {
  @IsString()
  @IsOptional()
  siteName?: string;

  @IsString()
  @IsOptional()
  bubbleColor?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  offlineMessage?: string;

  @IsString()
  @IsOptional()
  bubbleSize?: string;

  @IsString()
  @IsOptional()
  bubblePattern?: string;

  @IsString()
  @IsOptional()
  websitePosition?: string;

  @IsString()
  @IsOptional()
  bubbleIcon?: string;

  @IsString()
  @IsOptional()
  notificationSoundUrl?: string;

  @IsString()
  @IsOptional()
  allowedOrigins?: string;

  @IsString()
  @IsOptional()
  adminAllowedIps?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  enableReadReceipts?: boolean;

  @IsBoolean()
  @IsOptional()
  isOfflineMode?: boolean;
}

// ---------------------------------------------------------------------------
// Controller — REST endpoints for site configuration
// ---------------------------------------------------------------------------
@Controller('config')
export class SiteConfigController {
  constructor(
    private readonly siteConfigService: SiteConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Public endpoint — returns the active site config for the visitor widget.
   * No auth required so the widget can fetch its configuration.
   * Augments the response with `aiEnabled` based on whether an AI agent is configured.
   */
  @Get('active')
  async getActiveConfig() {
    const config = await this.siteConfigService.getActiveConfig();
    if (!config) return null;

    // Check if AI is enabled: an AiAgentConfig with an active provider must exist
    let aiEnabled = false;
    try {
      const agentConfig = await this.prisma.aiAgentConfig.findFirst();
      if (agentConfig?.enabled) {
        const provider = await this.prisma.aiProvider.findFirst({
          where: { isActive: true },
        });
        aiEnabled = !!provider;
      }
    } catch {
      // AI tables may not exist yet — that's fine, aiEnabled stays false
    }

    const { allowedOrigins, adminAllowedIps, ...publicConfig } = config as any;
    return { ...publicConfig, aiEnabled };
  }

  @Get('admin-active')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async getAdminActiveConfig() {
    return this.siteConfigService.getActiveConfig();
  }

  /**
   * Protected endpoints — admin only.
   */
  @Get()
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async listConfigs() {
    return this.siteConfigService.listConfigs();
  }

  @Get(':id')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async getConfig(@Param('id') id: string) {
    return this.siteConfigService.getConfig(id);
  }

  @Post()
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async createConfig(@Body() dto: CreateSiteConfigDto, @Req() req: AuthenticatedRequest) {
    if ((dto.allowedOrigins !== undefined || dto.adminAllowedIps !== undefined) && req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admins can update site security settings');
    }

    return this.siteConfigService.createConfig(dto);
  }

  @Patch(':id')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async updateConfig(
    @Param('id') id: string,
    @Body() dto: UpdateSiteConfigDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if ((dto.allowedOrigins !== undefined || dto.adminAllowedIps !== undefined) && req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admins can update site security settings');
    }

    return this.siteConfigService.updateConfig(id, dto);
  }
}
