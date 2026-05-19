import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminSecurityModule } from './auth/admin-security.module';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuickReplyModule } from './quick-reply/quick-reply.module';
import { UploadModule } from './upload/upload.module';
import { CommonModule } from './common/common.module';
import { SessionStateModule } from './session-state/session-state.module';
import { AiModule } from './ai/ai.module';
import { RagModule } from './rag/rag.module';
import { HttpLogModule } from './http-log/http-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
      { name: 'long', ttl: 3600000, limit: 1000 },
      { name: 'strict', ttl: 60000, limit: 20 },
    ]),
    PrismaModule,
    AdminSecurityModule,
    SessionStateModule,
    CommonModule,
    AuthModule,
    AiModule,
    RagModule,
    ChatModule,
    AppConfigModule,
    QuickReplyModule,
    UploadModule,
    HttpLogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
