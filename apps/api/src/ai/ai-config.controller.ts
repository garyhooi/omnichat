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
import { BudgetService } from './budget.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject, Max, Min } from 'class-validator';

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
  @IsNumber() @IsOptional() @Min(0) inputPricePerM?: number;
  @IsNumber() @IsOptional() @Min(0) outputPricePerM?: number;
  // Token spend budget per period (null = unlimited) — enforced before the AI answers.
  @IsInt() @IsOptional() @Min(0) maxTokensPerDay?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerWeek?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerMonth?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerQuarter?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerHalfYear?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerYear?: number | null;
}

class UpdateProviderDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() providerType?: string;
  @IsString() @IsOptional() apiKey?: string;
  @IsString() @IsOptional() baseUrl?: string;
  @IsString() @IsOptional() chatModelId?: string;
  @IsString() @IsOptional() embeddingModelId?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsNumber() @IsOptional() @Min(0) inputPricePerM?: number;
  @IsNumber() @IsOptional() @Min(0) outputPricePerM?: number;
  @IsInt() @IsOptional() @Min(0) maxTokensPerDay?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerWeek?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerMonth?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerQuarter?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerHalfYear?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerYear?: number | null;
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
  @IsNumber() @IsOptional() @Min(1) @Max(1440) spamIpBlacklistMinutes?: number;
  @IsString() @IsOptional() embeddingProviderId?: string | null;
  @IsString() @IsOptional() translateProviderId?: string | null;
  @IsBoolean() @IsOptional() translationEnabled?: boolean;
  @IsBoolean() @IsOptional() autoTranslationEnabled?: boolean;
  // Global token spend budget per period (null = unlimited) — applies across
  // all providers, in addition to each provider's own limits.
  @IsInt() @IsOptional() @Min(0) maxTokensPerDay?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerWeek?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerMonth?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerQuarter?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerHalfYear?: number | null;
  @IsInt() @IsOptional() @Min(0) maxTokensPerYear?: number | null;
}

class CreateToolDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() description: string;
  @IsObject() @IsNotEmpty() parametersSchema: Record<string, any>;
  @IsString() @IsOptional() handlerType?: string;
  @IsString() @IsOptional() endpoint?: string;
  @IsString() @IsOptional() authType?: string;
  @IsObject() @IsOptional() authConfig?: Record<string, any>;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

class UpdateToolDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsObject() @IsOptional() parametersSchema?: Record<string, any>;
  @IsString() @IsOptional() handlerType?: string;
  @IsString() @IsOptional() endpoint?: string;
  @IsString() @IsOptional() authType?: string;
  @IsObject() @IsOptional() authConfig?: Record<string, any>;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
@Controller('ai/config')
@UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'developer')
export class AiConfigController {
  constructor(
    private readonly aiConfigService: AiConfigService,
    private readonly budgetService: BudgetService,
  ) {}

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

  // --- Token spend budget status (used by the 80% warning banner) ---

  @Get('budget-status')
  async getBudgetStatus() {
    return this.budgetService.getStatus();
  }

  // --- Tool Registration ---

  @Get('tools')
  async getTools() {
    return this.aiConfigService.getTools();
  }

  @Post('tools')
  async createTool(@Body() dto: CreateToolDto) {
    return this.aiConfigService.createTool(dto);
  }

  @Patch('tools/:id')
  async updateTool(@Param('id') id: string, @Body() dto: UpdateToolDto) {
    return this.aiConfigService.updateTool(id, dto);
  }

  @Delete('tools/:id')
  async deleteTool(@Param('id') id: string) {
    return this.aiConfigService.deleteTool(id);
  }
}
