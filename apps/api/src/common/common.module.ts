import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OriginValidatorMiddleware } from './origin-validator.middleware';
import { RefererValidatorMiddleware } from './referer-validator.middleware';
import { SecurityLoggerService } from './security-logger.service';

@Module({
  providers: [SecurityLoggerService],
  exports: [SecurityLoggerService],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply origin validation to all HTTP routes except auth
    consumer
      .apply(OriginValidatorMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');

    // Apply referer validation as additional layer
    consumer
      .apply(RefererValidatorMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}