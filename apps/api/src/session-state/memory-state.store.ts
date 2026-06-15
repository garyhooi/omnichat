import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SessionStateStore } from './session-state.interface';

interface MemoryEntry {
  value: number;
  expiresAt?: number;
}

/**
 * In-memory fallback for SessionStateStore when Redis is not configured.
 * Uses a Map with TTL support via periodic cleanup.
 */
@Injectable()
export class MemoryStateStore implements SessionStateStore, OnModuleDestroy {
  private readonly logger = new Logger(MemoryStateStore.name);
  private readonly store = new Map<string, MemoryEntry>();
  private cleanupInterval: NodeJS.Timeout;

  private static readonly KEY_PREFIX = 'omnichat:';
  private static readonly MAX_ENTRIES = 10_000;
  private static readonly CLEANUP_INTERVAL_MS = 30_000;

  private prefixKey(key: string): string {
    return `${MemoryStateStore.KEY_PREFIX}${key}`;
  }

  constructor() {
    // Clean expired entries every 30 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), MemoryStateStore.CLEANUP_INTERVAL_MS);
    this.logger.log('Using in-memory session state store (Redis not configured)');
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.store.delete(key);
      }
    }
  }

  private evictIfNeeded() {
    if (this.store.size < MemoryStateStore.MAX_ENTRIES) return;
    // Evict oldest expired entry first, then the oldest entry overall
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.store) {
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        this.store.delete(key);
        return;
      }
      if (!entry.expiresAt || entry.expiresAt < oldestTime) {
        oldestKey = key;
        oldestTime = entry.expiresAt ?? Infinity;
      }
    }
    if (oldestKey) this.store.delete(oldestKey);
  }

  private getEntry(key: string): MemoryEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  async get(key: string): Promise<number> {
    return this.getEntry(this.prefixKey(key))?.value ?? 0;
  }

  async set(key: string, value: number, ttlSeconds?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    if (!ttlSeconds) {
      this.logger.warn(`Entry "${prefixedKey}" set without TTL — will persist until eviction`);
    }
    this.evictIfNeeded();
    this.store.set(prefixedKey, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    this.evictIfNeeded();
    const prefixedKey = this.prefixKey(key);
    const existing = this.getEntry(prefixedKey);
    const newVal = (existing?.value ?? 0) + 1;
    this.store.set(prefixedKey, {
      value: newVal,
      expiresAt: existing?.expiresAt ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined),
    });
    if (existing?.expiresAt === undefined && ttlSeconds === undefined) {
      this.logger.warn(`Entry "${prefixedKey}" incremented without TTL — will persist until eviction`);
    }
    return newVal;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(this.prefixKey(key));
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }
}
