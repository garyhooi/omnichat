import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SessionStateStore } from './session-state.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisStateStore implements SessionStateStore, OnModuleDestroy {
  private readonly logger = new Logger(RedisStateStore.name);
  private readonly client: Redis;
  private static readonly KEY_PREFIX = 'omnichat:';
  private reconnectAttempts = 0;
  private static readonly MAX_RECONNECT_ATTEMPTS = 30;
  private static readonly RECONNECT_BASE_MS = 200;
  private static readonly RECONNECT_MAX_MS = 5000;

  private prefixKey(key: string): string {
    return `${RedisStateStore.KEY_PREFIX}${key}`;
  }

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        this.reconnectAttempts = times;
        if (times > RedisStateStore.MAX_RECONNECT_ATTEMPTS) {
          this.logger.error(`Redis reconnect failed after ${times} attempts — giving up`);
          return null; // stop retrying
        }
        return Math.min(times * RedisStateStore.RECONNECT_BASE_MS, RedisStateStore.RECONNECT_MAX_MS);
      },
    });
    this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
    this.client.on('connect', () => {
      this.reconnectAttempts = 0;
      this.logger.log('Connected to Redis');
    });
  }

  async get(key: string): Promise<number> {
    const val = await this.client.get(this.prefixKey(key));
    return val ? parseInt(val, 10) : 0;
  }

  async set(key: string, value: number, ttlSeconds?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    if (ttlSeconds) {
      await this.client.setex(prefixedKey, ttlSeconds, value.toString());
    } else {
      await this.client.set(prefixedKey, value.toString());
    }
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const prefixedKey = this.prefixKey(key);
    const val = await this.client.incr(prefixedKey);
    if (ttlSeconds && val === 1) {
      await this.client.expire(prefixedKey, ttlSeconds);
    }
    return val;
  }

  async reset(key: string): Promise<void> {
    await this.client.del(this.prefixKey(key));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
