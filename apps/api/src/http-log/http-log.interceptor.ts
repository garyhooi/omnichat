import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpLogService } from './http-log.service';

const SENSITIVE_HEADERS = new Set([
  'authorization', 'cookie', 'x-admin-api-key', 'set-cookie',
]);

const SENSITIVE_BODY_FIELDS = new Set([
  'password', 'passwordHash', 'apiKey', 'token', 'accessToken', 'secret',
]);

function sanitiseHeaders(
  raw: Record<string, string | string[]> | undefined,
): string | undefined {
  if (!raw) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    cleaned[k] = SENSITIVE_HEADERS.has(k.toLowerCase()) ? '***' : v;
  }
  return JSON.stringify(cleaned);
}

function sanitiseBody(body: any): string | undefined {
  if (!body || typeof body !== 'object') return body ? String(body) : undefined;
  try {
    const clone = { ...body };
    for (const key of Object.keys(clone)) {
      if (SENSITIVE_BODY_FIELDS.has(key)) clone[key] = '***';
    }
    const str = JSON.stringify(clone);
    return str.length > 4096 ? str.slice(0, 4096) + '...[truncated]' : str;
  } catch {
    return '[unserializable]';
  }
}

function truncateResponse(body: any): string | undefined {
  if (body === undefined || body === null) return undefined;
  try {
    const str = typeof body === 'string' ? body : JSON.stringify(body);
    return str.length > 2048 ? str.slice(0, 2048) + '...[truncated]' : str;
  } catch {
    return '[unserializable]';
  }
}

@Injectable()
export class HttpLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLogInterceptor.name);

  private static readonly MAX_QUEUE_SIZE = 100;
  private logQueue: Array<() => Promise<void>> = [];
  private processing = false;

  constructor(private readonly httpLogService: HttpLogService) {}

  private enqueueLog(logFn: () => Promise<void>): void {
    if (this.logQueue.length >= HttpLogInterceptor.MAX_QUEUE_SIZE) {
      this.logger.warn('Log queue full, dropping oldest entry');
      this.logQueue.shift();
    }
    this.logQueue.push(logFn);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    while (this.logQueue.length > 0) {
      const fn = this.logQueue[0];
      try {
        await fn();
      } catch (err) {
        this.logger.error(`Failed to write HTTP log: ${err instanceof Error ? err.message : String(err)}`);
      }
      this.logQueue.shift();
    }
    this.processing = false;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const start = Date.now();

    const userId = req.user?.sub || req.user?.id || undefined;
    const username = req.user?.username || undefined;

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const res = ctx.getResponse();
          const duration = Date.now() - start;

          const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            clientIp: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers?.['user-agent'],
            userId,
            username,
            requestHeaders: sanitiseHeaders(req.headers),
            requestBody: sanitiseBody(req.body),
            responseBody: truncateResponse(responseBody),
            contentLength: res.getHeader?.('content-length')
              ? parseInt(res.getHeader('content-length'), 10)
              : undefined,
            duration,
          };

          this.enqueueLog(() =>
            this.httpLogService.createLog(logData).catch((err) => {
              this.logger.error(`Failed to write HTTP log: ${err.message}`);
            }),
          );
        },
        error: (err) => {
          const res = ctx.getResponse();
          const duration = Date.now() - start;

          const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: err.status || err.statusCode || 500,
            clientIp: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers?.['user-agent'],
            userId,
            username,
            requestHeaders: sanitiseHeaders(req.headers),
            requestBody: sanitiseBody(req.body),
            responseBody: JSON.stringify({
              error: err.message,
              statusCode: err.status || err.statusCode || 500,
            }),
            duration,
          };

          this.enqueueLog(() =>
            this.httpLogService.createLog(logData).catch((err) => {
              this.logger.error(`Failed to write HTTP log: ${err.message}`);
            }),
          );
        },
      }),
    );
  }
}
