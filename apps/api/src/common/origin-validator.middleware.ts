import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityLoggerService } from './security-logger.service';

/** Compare origins using hostname to prevent subdomain spoofing. */
function isOriginAllowed(candidateOrigin: string, allowedOrigin: string): boolean {
  try {
    const candidateHost = new URL(candidateOrigin).hostname;
    const allowedHost = new URL(allowedOrigin).hostname;
    if (candidateHost === allowedHost) return true;
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

    // Skip validation for admin endpoints (called from master website, may not send Origin)
    if (req.path.startsWith('/auth/') || req.path.startsWith('/config/')) {
      return next();
    }

    if (!origin && !referer) {
      return next();
    }

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

      if (config.allowedOrigins === '*') {
        return next();
      }

      const allowedOrigins = config.allowedOrigins.split(',').map((s: string) => s.trim());
      
      if (origin) {
        const originAllowed = allowedOrigins.some((allowed: string) => isOriginAllowed(origin, allowed));
        if (originAllowed) return next();
      }

      if (referer) {
        try {
          const refererOrigin = new URL(referer).origin;
          const refererAllowed = allowedOrigins.some((allowed: string) => isOriginAllowed(refererOrigin, allowed));
          if (refererAllowed) return next();
        } catch {}
      }

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
