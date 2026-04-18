/**
 * SessionStateStore — abstraction for per-conversation AI state tracking.
 * Backed by Redis when available, falls back to in-memory Map + Prisma DB.
 */
export interface SessionStateStore {
  get(key: string): Promise<number>;
  set(key: string, value: number, ttlSeconds?: number): Promise<void>;
  increment(key: string, ttlSeconds?: number): Promise<number>;
  reset(key: string): Promise<void>;
}

export const SESSION_STATE_STORE = 'SESSION_STATE_STORE';
