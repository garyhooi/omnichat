import {
  Body,
  Controller,
  Post,
  Req,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { generateText } from 'ai';
import { AiConfigService } from './ai-config.service';
import { AiProviderFactory } from './ai-provider.factory';
import { SESSION_STATE_STORE, SessionStateStore } from '../session-state/session-state.interface';
import { IsNotEmpty, IsString } from 'class-validator';

class TranslateDto {
  @IsString() @IsNotEmpty() text: string;
  @IsString() @IsNotEmpty() targetLanguage: string;
}

@Controller('ai/translate')
export class AiTranslateController {
  private readonly logger = new Logger(AiTranslateController.name);

  private readonly languageNames: Record<string, string> = {
    en: 'English',
    'zh-Hans': 'Simplified Chinese',
    'zh-Hant': 'Traditional Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    es: 'Spanish',
    pt: 'Portuguese',
    nl: 'Dutch',
    pl: 'Polish',
    tr: 'Turkish',
    ar: 'Arabic',
    ru: 'Russian',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    hi: 'Hindi',
  };

  constructor(
    private readonly aiConfigService: AiConfigService,
    private readonly providerFactory: AiProviderFactory,
    @Inject(SESSION_STATE_STORE)
    private readonly stateStore: SessionStateStore,
  ) {}

  @Post()
  @Throttle({ short: { limit: 5, ttl: 1000 }, medium: { limit: 30, ttl: 60000 } })
  async translate(@Body() dto: TranslateDto, @Req() req: Request) {
    const { text, targetLanguage } = dto;

    if (!text?.trim()) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }
    if (!targetLanguage?.trim()) {
      throw new HttpException('Target language is required', HttpStatus.BAD_REQUEST);
    }

    if (text.length > 5000) {
      throw new HttpException('Text exceeds maximum length of 5000 characters', HttpStatus.BAD_REQUEST);
    }

    const agentConfig = await this.aiConfigService.getAgentConfig();
    if (!agentConfig?.enabled) {
      throw new HttpException('AI agent is not enabled', HttpStatus.SERVICE_UNAVAILABLE);
    }

    if (agentConfig?.translationEnabled === false) {
      throw new HttpException('Translation is disabled', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const visitorIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';

    const rateLimitKey = `translate:${visitorIp}`;
    const current = await this.stateStore.increment(rateLimitKey, 60000);
    const limit = (agentConfig?.aiRateLimitPerMinute ?? 10) * 3;
    if (current > limit) {
      this.logger.warn(`Translation rate limit exceeded for IP ${visitorIp} (${current}/${limit})`);
      throw new HttpException('Too many translation requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const providerConfig = await this.aiConfigService.getTranslationProvider();
    if (!providerConfig) {
      throw new HttpException('No active AI provider configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      const model = this.providerFactory.createLanguageModel(providerConfig);
      const langName = this.languageNames[targetLanguage] || targetLanguage;

      const result = await generateText({
        model,
        system: `You are a professional translator. Translate the user's text into ${langName}. Return ONLY the translated text, with no explanations, notes, or quotation marks. Preserve markdown formatting if present.`,
        prompt: text,
        temperature: 0.1,
        maxTokens: Math.max(text.length * 2, 256),
      });

      return { translatedText: result.text.trim(), targetLanguage };
    } catch (error: any) {
      this.logger.error(`Translation failed: ${error.message}`);
      if (error.status === 402 || error.status === 429 || error.message?.includes('quota') || error.message?.includes('credit')) {
        throw new HttpException('AI provider credit/quota exhausted', HttpStatus.SERVICE_UNAVAILABLE);
      }
      throw new HttpException('Translation service error. Please try again.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
