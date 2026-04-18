import { Injectable, Logger } from '@nestjs/common';
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
export class MemoryStateStore implements SessionStateStore {
  private readonly logger = new Logger(MemoryStateStore.name);
  private readonly store = new Map<string, MemoryEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
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
    return this.getEntry(key)?.value ?? 0;
  }

  async set(key: string, value: number, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const existing = this.getEntry(key);
    const newVal = (existing?.value ?? 0) + 1;
    this.store.set(key, {
      value: newVal,
      expiresAt: existing?.expiresAt ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined),
    });
    return newVal;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }
}
