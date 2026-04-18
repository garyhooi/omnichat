import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLogService } from './http-log.service';
import { HttpLogInterceptor } from './http-log.interceptor';
import { HttpLogController } from './http-log.controller';
import { AiLogController } from './ai-log.controller';

@Module({
  providers: [
    HttpLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLogInterceptor,
    },
  ],
  controllers: [HttpLogController, AiLogController],
  exports: [HttpLogService],
})
export class HttpLogModule {}
