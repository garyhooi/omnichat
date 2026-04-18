import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SiteConfigService } from './site-config.service';
import { PrismaService } from '../prisma/prisma.service';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

    return { ...config, aiEnabled };
  }

  /**
   * Protected endpoints — admin only.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listConfigs() {
    return this.siteConfigService.listConfigs();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getConfig(@Param('id') id: string) {
    return this.siteConfigService.getConfig(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createConfig(@Body() dto: CreateSiteConfigDto) {
    return this.siteConfigService.createConfig(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateConfig(
    @Param('id') id: string,
    @Body() dto: UpdateSiteConfigDto,
  ) {
    return this.siteConfigService.updateConfig(id, dto);
  }
}
