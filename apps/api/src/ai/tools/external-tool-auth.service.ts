import { Injectable, Logger } from '@nestjs/common';
import { ToolContext } from './tool.interface';

interface CachedToken {
  token: string;
  expiresAt: number;
}

@Injectable()
export class ExternalToolAuthService {
  private readonly logger = new Logger(ExternalToolAuthService.name);
  private readonly tokenCache = new Map<string, CachedToken>();
  private static readonly MAX_CACHE_SIZE = 1000;
  private static readonly PRUNE_TARGET = 100; // remove oldest 100 when over limit
  private cacheAccessCount = 0;

  async getToken(
    authConfig: Record<string, any> | null,
    authType: string | null,
    context: ToolContext,
  ): Promise<string | null> {
    if (!authType || authType === 'none' || !authConfig) {
      return null;
    }

    if (authType === 'static') {
      return authConfig.token || null;
    }

    if (authType === 'token-exchange') {
      return this.exchangeToken(authConfig, context);
    }

    return null;
  }

  private async exchangeToken(
    authConfig: Record<string, any>,
    context: ToolContext,
  ): Promise<string> {
    const cacheKey = context.visitorId || 'default';
    const cached = this.tokenCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.token;
    }

    const { tokenUrl } = authConfig;
    if (!tokenUrl) {
      throw new Error('token-exchange auth requires tokenUrl');
    }

    const metadata = context.metadata || {};
    const externalAuthToken = metadata.externalAuthToken;
    if (!externalAuthToken) {
      throw new Error('No externalAuthToken in conversation metadata');
    }

    this.logger.log(`Exchanging token for tool -> ${tokenUrl}`);

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ external_auth_token: externalAuthToken }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token exchange failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    const token = data.access_token || data.token;
    if (!token) {
      throw new Error('Token exchange response missing access_token');
    }

    const expiresIn = data.expires_in || 300;
    this.tokenCache.set(cacheKey, {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    });

    // Periodically prune expired entries and enforce max cache size
    this.cacheAccessCount++;
    if (this.cacheAccessCount % 10 === 0) {
      this.pruneExpiredEntries();
    }

    return token;
  }

  clearCache(visitorId?: string): void {
    if (visitorId) {
      this.tokenCache.delete(visitorId);
    } else {
      this.tokenCache.clear();
    }
  }

  /** Prune expired entries and enforce max cache size. */
  private pruneExpiredEntries(): void {
    const now = Date.now();
    let expired = 0;
    for (const [key, entry] of this.tokenCache) {
      if (now >= entry.expiresAt) {
        this.tokenCache.delete(key);
        expired++;
      }
    }
    if (this.tokenCache.size > ExternalToolAuthService.MAX_CACHE_SIZE) {
      const excess = this.tokenCache.size - ExternalToolAuthService.MAX_CACHE_SIZE;
      const toRemove = Math.min(excess + ExternalToolAuthService.PRUNE_TARGET, this.tokenCache.size);
      const iter = this.tokenCache.keys();
      for (let i = 0; i < toRemove; i++) {
        const key = iter.next();
        if (key.done) break;
        this.tokenCache.delete(key.value);
      }
      this.logger.warn(`Token cache pruned: removed ${toRemove} entries (size: ${this.tokenCache.size})`);
    }
    if (expired > 0) {
      this.logger.log(`Token cache: evicted ${expired} expired entries`);
    }
  }
}
