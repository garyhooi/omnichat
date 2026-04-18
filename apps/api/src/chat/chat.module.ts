import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { AppConfigModule } from '../config/config.module';
import { AiModule } from '../ai/ai.module';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [AuthModule, UploadModule, AppConfigModule, AiModule, RagModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
