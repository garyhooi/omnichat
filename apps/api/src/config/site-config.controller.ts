import {
  BadRequestException,
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
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';

/** A bad zone makes every Intl formatter throw — reject it at the door. */
function assertValidTimeZone(value?: string) {
  if (!value) return;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
  } catch {
    throw new BadRequestException(`Unknown timezone: ${value}`);
  }
}

type AuthenticatedRequest = {
  user?: {
    role?: string;
  };
};


class CreateSiteConfigDto {
  @IsString()
  @IsNotEmpty()
  siteName: string;

  /** IANA zone for every rendered datetime; omit to follow the viewer's zone. */
  @IsString()
  @IsOptional()
  displayTimezone?: string;

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
  greetingMessage?: string;

  @IsString()
  @IsOptional()
  visitorLanguage?: string;

  @IsString()
  @IsOptional()
  adminLanguage?: string;

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
  bubbleIcon?: string

  @IsString()
  @IsOptional()
  aiAvatar?: string;

  @IsString()
  @IsOptional()
  agentAvatar?: string;

  @IsString()
  @IsOptional()
  visitorAvatar?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\/uploads\/|^https:\/\//, { message: 'visitorNotificationSoundUrl must be a /uploads/ path or https URL' })
  visitorNotificationSoundUrl?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\/uploads\/|^https:\/\//, { message: 'agentNotificationSoundUrl must be a /uploads/ path or https URL' })
  agentNotificationSoundUrl?: string;

  @IsBoolean()
  @IsOptional()
  showAdminWidget?: boolean;

  @IsBoolean()
  @IsOptional()
  showVisitorWidget?: boolean;

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

  /** IANA zone for every rendered datetime; omit to follow the viewer's zone. */
  @IsString()
  @IsOptional()
  displayTimezone?: string;

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
  greetingMessage?: string;

  @IsString()
  @IsOptional()
  visitorLanguage?: string;

  @IsString()
  @IsOptional()
  adminLanguage?: string;

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
  aiAvatar?: string;

  @IsString()
  @IsOptional()
  agentAvatar?: string;

  @IsString()
  @IsOptional()
  visitorAvatar?: string;

  @IsBoolean()
  @IsOptional()
  showAdminWidget?: boolean;

  @IsBoolean()
  @IsOptional()
  showVisitorWidget?: boolean;

  @IsString()
  @IsOptional()
  @Matches(/^\/uploads\/|^https:\/\//, { message: 'visitorNotificationSoundUrl must be a /uploads/ path or https URL' })
  visitorNotificationSoundUrl?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\/uploads\/|^https:\/\//, { message: 'agentNotificationSoundUrl must be a /uploads/ path or https URL' })
  agentNotificationSoundUrl?: string;

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


@Controller('config')
export class SiteConfigController {
  constructor(
    private readonly siteConfigService: SiteConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Public endpoint — returns active site config for the visitor widget. */
  @Get('active')
  async getActiveConfig() {
    const config = await this.siteConfigService.getActiveConfig();
    if (!config) return null;

    let aiEnabled = false;
    let translationEnabled = false;
    let autoTranslationEnabled = true;
    try {
      const agentConfig = await this.prisma.aiAgentConfig.findFirst();
      if (agentConfig?.enabled) {
        const provider = await this.prisma.aiProvider.findFirst({
          where: { isActive: true },
        });
        aiEnabled = !!provider;
      }
      translationEnabled = agentConfig?.translationEnabled !== false;
      autoTranslationEnabled = agentConfig?.autoTranslationEnabled !== false;
    } catch {} // AI tables may not exist yet

    const { allowedOrigins, adminAllowedIps, ...publicConfig } = config as any;
    return { ...publicConfig, aiEnabled, translationEnabled, autoTranslationEnabled };
  }

  @Get('admin-active')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async getAdminActiveConfig() {
    return this.siteConfigService.getActiveConfig();
  }

  /** Protected endpoints — admin only. */
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
    if ((dto.allowedOrigins !== undefined || dto.adminAllowedIps !== undefined) && req.user?.role !== 'developer') {
      throw new ForbiddenException('Only developers can update site security settings');
    }
    assertValidTimeZone(dto.displayTimezone);

    return this.siteConfigService.createConfig(dto);
  }

  @Patch(':id')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async updateConfig(
    @Param('id') id: string,
    @Body() dto: UpdateSiteConfigDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if ((dto.allowedOrigins !== undefined || dto.adminAllowedIps !== undefined) && req.user?.role !== 'developer') {
      throw new ForbiddenException('Only developers can update site security settings');
    }
    assertValidTimeZone(dto.displayTimezone);

    return this.siteConfigService.updateConfig(id, dto);
  }
}
