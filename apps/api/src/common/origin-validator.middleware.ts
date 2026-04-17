import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityLoggerService } from './security-logger.service';

@Injectable()
export class OriginValidatorMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityLogger: SecurityLoggerService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Skip validation for admin endpoints (they use JWT auth)
    if (req.path.startsWith('/auth/') || req.path.startsWith('/config/') && req.method !== 'GET') {
      return next();
    }

    // Allow requests with no origin (mobile apps, curl, etc.)
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
        const isOriginAllowed = allowedOrigins.some((allowedOrigin: string) => {
          return origin === allowedOrigin || 
                 origin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isOriginAllowed) {
          return next();
        }
      }

      // Fallback to referer validation
      if (referer) {
        const refererOrigin = new URL(referer).origin;
        const isRefererAllowed = allowedOrigins.some((allowedOrigin: string) => {
          return refererOrigin === allowedOrigin || 
                 refererOrigin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isRefererAllowed) {
          return next();
        }
      }

      this.securityLogger.logOriginViolation(origin || '', referer || '', ip);
      throw new ForbiddenException(`Origin not allowed: ${origin || referer}`);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Origin validation failed');
    }
  }
}