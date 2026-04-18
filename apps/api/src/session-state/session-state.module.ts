import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESSION_STATE_STORE } from './session-state.interface';
import { RedisStateStore } from './redis-state.store';
import { MemoryStateStore } from './memory-state.store';

@Global()
@Module({
  providers: [
    {
      provide: SESSION_STATE_STORE,
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (redisUrl) {
          return new RedisStateStore(redisUrl);
        }
        return new MemoryStateStore();
      },
      inject: [ConfigService],
    },
  ],
  exports: [SESSION_STATE_STORE],
})
export class SessionStateModule {}
