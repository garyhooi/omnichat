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
    // Load .env and make ConfigService available globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Enhanced rate limiting for HTTP endpoints with multiple tiers
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
      {
        name: 'strict',
        ttl: 60000, // 1 minute
        limit: 20, // 20 requests per minute for sensitive endpoints
      },
    ]),
    PrismaModule,
    AdminSecurityModule,
    SessionStateModule,
    CommonModule, // Security middleware
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
