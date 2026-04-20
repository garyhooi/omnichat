import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityLoggerService } from './security-logger.service';

/**
 * Safely compare a candidate origin against an allowed origin.
 * Parses as URLs and compares hostnames to prevent subdomain spoofing
 * (e.g. "evil-example.com" must NOT match "example.com").
 */
function isOriginAllowed(candidateOrigin: string, allowedOrigin: string): boolean {
  try {
    const candidateHost = new URL(candidateOrigin).hostname;
    const allowedHost = new URL(allowedOrigin).hostname;
    if (candidateHost === allowedHost) return true;
    // Genuine subdomain: "sub.example.com" ends with ".example.com"
    return candidateHost.endsWith('.' + allowedHost);
  } catch {
    return candidateOrigin === allowedOrigin;
  }
}

@Injectable()
export class OriginValidatorMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityLogger: SecurityLoggerService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin as string | undefined;
    const referer = req.headers.referer as string | undefined;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Skip validation for admin endpoints (they use JWT auth / master website API calls).
    // These endpoints are called from the master website API which may not send an Origin header.
    if (req.path.startsWith('/auth/') || req.path.startsWith('/config/')) {
      return next();
    }

    // Allow requests with no origin (server-to-server, mobile apps, etc.)
    if (!origin && !referer) {
      return next();
    }

    // Allow localhost for development
    if ((origin && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) ||
        (referer && (referer.startsWith('http://localhost') || referer.startsWith('http://127.0.0.1')))) {
      return next();
    }

    try {
      const config = await this.prisma.siteConfig.findFirst({
        where: { isActive: true },
      });

      if (!config || !config.allowedOrigins) {
        throw new ForbiddenException('Origin validation not configured');
      }

      // Wildcard allows all origins
      if (config.allowedOrigins === '*') {
        return next();
      }

      const allowedOrigins = config.allowedOrigins.split(',').map((s: string) => s.trim());
      
      // Validate origin header
      if (origin) {
        const originAllowed = allowedOrigins.some((allowed: string) => isOriginAllowed(origin, allowed));
        if (originAllowed) return next();
      }

      // Fallback to referer validation
      if (referer) {
        try {
          const refererOrigin = new URL(referer).origin;
          const refererAllowed = allowedOrigins.some((allowed: string) => isOriginAllowed(refererOrigin, allowed));
          if (refererAllowed) return next();
        } catch {
          // Invalid referer URL — fall through to rejection
        }
      }

      // Sanitize reflected values: truncate and strip control characters
      const safeOrigin = (origin || referer || '').substring(0, 100).replace(/[\r\n\t]/g, '');
      this.securityLogger.logOriginViolation(origin || '', referer || '', ip);
      throw new ForbiddenException(`Origin not allowed: ${safeOrigin}`);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Origin validation failed');
    }
  }
}
