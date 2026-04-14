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
  @IsNotEmpty()
  allowedOrigins: string;

  @IsBoolean()
  @IsOptional()
  enableReadReceipts?: boolean;
}

class UpdateSiteConfigDto {
  @IsString()
  @IsOptional()
  bubbleColor?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

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
  allowedOrigins?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  enableReadReceipts?: boolean;
}

// ---------------------------------------------------------------------------
// Controller — REST endpoints for site configuration
// ---------------------------------------------------------------------------
@Controller('config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  /**
   * Public endpoint — returns the active site config for the visitor widget.
   * No auth required so the widget can fetch its configuration.
   */
  @Get('active')
  async getActiveConfig() {
    return this.siteConfigService.getActiveConfig();
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
