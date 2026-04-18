import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SessionStateStore } from './session-state.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisStateStore implements SessionStateStore, OnModuleDestroy {
  private readonly logger = new Logger(RedisStateStore.name);
  private readonly client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });
    this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
    this.client.on('connect', () => this.logger.log('Connected to Redis'));
  }

  async get(key: string): Promise<number> {
    const val = await this.client.get(key);
    return val ? parseInt(val, 10) : 0;
  }

  async set(key: string, value: number, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value.toString());
    } else {
      await this.client.set(key, value.toString());
    }
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const val = await this.client.incr(key);
    if (ttlSeconds && val === 1) {
      await this.client.expire(key, ttlSeconds);
    }
    return val;
  }

  async reset(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
