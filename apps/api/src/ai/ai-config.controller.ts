import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiConfigService } from './ai-config.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------
class CreateProviderDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() providerType: string;
  @IsString() @IsOptional() apiKey?: string;
  @IsString() @IsOptional() baseUrl?: string;
  @IsString() @IsNotEmpty() chatModelId: string;
  @IsString() @IsOptional() embeddingModelId?: string;
}

class UpdateProviderDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() providerType?: string;
  @IsString() @IsOptional() apiKey?: string;
  @IsString() @IsOptional() baseUrl?: string;
  @IsString() @IsOptional() chatModelId?: string;
  @IsString() @IsOptional() embeddingModelId?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

class UpsertAgentConfigDto {
  @IsBoolean() @IsOptional() enabled?: boolean;
  @IsString() @IsOptional() systemPrompt?: string;
  @IsString() @IsOptional() greetingMessage?: string;
  @IsString() @IsOptional() humanRequestKeywords?: string;
  @IsNumber() @IsOptional() @Min(1) @Max(16384) maxTokensPerResponse?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(2) temperature?: number;
  @IsNumber() @IsOptional() @Min(1) @Max(200) maxTurnsPerConversation?: number;
  @IsNumber() @IsOptional() @Min(1000) maxTokensPerSession?: number;
  @IsNumber() @IsOptional() @Min(1) @Max(10) ragFailureThreshold?: number;
  @IsNumber() @IsOptional() @Min(1) @Max(10) humanRequestThreshold?: number;
  @IsNumber() @IsOptional() @Min(1) @Max(60) aiRateLimitPerMinute?: number;
  @IsString() @IsOptional() embeddingProviderId?: string | null;
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
@Controller('ai/config')
@UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AiConfigController {
  constructor(private readonly aiConfigService: AiConfigService) {}

  // --- Providers ---

  @Get('providers')
  async getProviders() {
    return this.aiConfigService.getProviders();
  }

  @Post('providers')
  async createProvider(@Body() dto: CreateProviderDto) {
    return this.aiConfigService.createProvider(dto);
  }

  @Patch('providers/:id')
  async updateProvider(@Param('id') id: string, @Body() dto: UpdateProviderDto) {
    return this.aiConfigService.updateProvider(id, dto);
  }

  @Delete('providers/:id')
  async deleteProvider(@Param('id') id: string) {
    return this.aiConfigService.deleteProvider(id);
  }

  @Post('providers/:id/test')
  async testProvider(@Param('id') id: string) {
    return this.aiConfigService.testProviderConnection(id);
  }

  // --- Agent Config ---

  @Get('agent')
  async getAgentConfig() {
    return this.aiConfigService.getAgentConfig();
  }

  @Post('agent')
  async upsertAgentConfig(@Body() dto: UpsertAgentConfigDto) {
    return this.aiConfigService.upsertAgentConfig(dto);
  }
}
