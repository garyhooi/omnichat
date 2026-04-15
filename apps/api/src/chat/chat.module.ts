import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AuthModule, UploadModule, AppConfigModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
