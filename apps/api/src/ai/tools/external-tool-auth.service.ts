import { Injectable, Logger } from '@nestjs/common';
import { ToolContext } from './tool.interface';

interface CachedToken {
  token: string;
  expiresAt: number;
}

export class TokenExchangeError extends Error {
  constructor(
    message: string,
    public readonly requestUrl: string,
    public readonly requestHeaders: Record<string, string>,
    public readonly requestBody: string,
    public readonly responseStatus?: number,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = 'TokenExchangeError';
  }
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

    // The external_auth_token JWT goes in the Authorization header,
    // matching how the external site's token endpoint expects it.
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${externalAuthToken}`,
    };

    // Build sanitised version for logging (mask sensitive headers)
    const sanitisedHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(requestHeaders)) {
      const lk = k.toLowerCase();
      if (lk === 'authorization' || lk === 'x-api-key' || lk === 'cookie' || lk === 'set-cookie') {
        sanitisedHeaders[k] = '***';
      } else {
        sanitisedHeaders[k] = v;
      }
    }

    const requestBody = '{}';

    this.logger.log(`Token exchange -> POST ${tokenUrl}`);
    this.logger.log(`Token exchange request headers: ${JSON.stringify(sanitisedHeaders)}`);
    this.logger.log(`Token exchange request body: ${requestBody}`);

    let res: Response;
    try {
      res = await fetch(tokenUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
      });
    } catch (err: any) {
      this.logger.error(`Token exchange network error: ${err.message}`);
      throw new TokenExchangeError(
        `Token exchange network error: ${err.message}`,
        tokenUrl,
        sanitisedHeaders,
        requestBody,
      );
    }

    if (!res.ok) {
      const text = await res.text();
      const msg = `Token exchange failed (${res.status}): ${text || '(empty response)'}`;
      this.logger.error(msg);
      throw new TokenExchangeError(
        msg,
        tokenUrl,
        sanitisedHeaders,
        requestBody,
        res.status,
        text || undefined,
      );
    }

    let data: any;
    try {
      data = await res.json();
    } catch {
      const msg = 'Token exchange response was not valid JSON';
      this.logger.error(msg);
      throw new TokenExchangeError(
        msg,
        tokenUrl,
        sanitisedHeaders,
        requestBody,
        res.status,
      );
    }

    const token = data.access_token || data.token;
    if (!token) {
      const msg = `Token exchange response missing access_token. Full response: ${JSON.stringify(data)}`;
      this.logger.error(msg);
      throw new TokenExchangeError(
        msg,
        tokenUrl,
        sanitisedHeaders,
        requestBody,
        res.status,
        JSON.stringify(data),
      );
    }

    this.logger.log(`Token exchange succeeded, token expires in ${data.expires_in || 300}s`);

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
