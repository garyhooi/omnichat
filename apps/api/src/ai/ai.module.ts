import { Module } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { AiService } from './ai.service';
import { AiConfigService } from './ai-config.service';
import { AiConfigController } from './ai-config.controller';
import { AiChatController } from './ai-chat.controller';
import { HandoffService } from './handoff.service';
import { AiSecurityService } from './ai-security.service';
import { ToolRegistry } from './tools/tool-registry';
import { AiLogService } from './ai-log.service';
import { SessionStateModule } from '../session-state/session-state.module';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [SessionStateModule, AppConfigModule],
  providers: [
    AiProviderFactory,
    AiService,
    AiConfigService,
    HandoffService,
    AiSecurityService,
    ToolRegistry,
    AiLogService,
  ],
  controllers: [AiConfigController, AiChatController],
  exports: [
    AiService,
    AiConfigService,
    AiProviderFactory,
    HandoffService,
    AiSecurityService,
    ToolRegistry,
    AiLogService,
  ],
})
export class AiModule {}
