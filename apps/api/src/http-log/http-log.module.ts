import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLogService } from './http-log.service';
import { HttpLogInterceptor } from './http-log.interceptor';
import { HttpLogController } from './http-log.controller';
import { AiLogController } from './ai-log.controller';
import { ToolLogService } from './tool-log.service';
import { ToolLogController } from './tool-log.controller';

@Module({
  providers: [
    HttpLogService,
    ToolLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLogInterceptor,
    },
  ],
  controllers: [HttpLogController, AiLogController, ToolLogController],
  exports: [HttpLogService, ToolLogService],
})
export class HttpLogModule {}
