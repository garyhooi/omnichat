import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityLoggerService } from './security-logger.service';

@Injectable()
export class RefererValidatorMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityLogger: SecurityLoggerService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const referer = req.headers.referer;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Skip validation for admin endpoints (they use JWT auth)
    if (req.path.startsWith('/auth/') || (req.path.startsWith('/config/') && req.method !== 'GET')) {
      return next();
    }

    // Allow requests with no referer (mobile apps, curl, etc.)
    if (!referer) {
      return next();
    }

    // Allow localhost for development
    if (referer.startsWith('http://localhost') || referer.startsWith('http://127.0.0.1')) {
      return next();
    }

    try {
      const config = await this.prisma.siteConfig.findFirst({
        where: { isActive: true },
      });

      if (!config || !config.allowedOrigins) {
        throw new ForbiddenException('Referer validation not configured');
      }

      // Wildcard allows all referers
      if (config.allowedOrigins === '*') {
        return next();
      }

      const allowedOrigins = config.allowedOrigins.split(',').map((s: string) => s.trim());
      
      // Extract origin from referer
      let refererOrigin: string;
      try {
        refererOrigin = new URL(referer).origin;
      } catch {
        this.securityLogger.logSuspiciousActivity(ip, 'Invalid referer format', referer);
        throw new ForbiddenException('Invalid referer header');
      }

      // Validate referer origin
      const isRefererAllowed = allowedOrigins.some((allowedOrigin: string) => {
        return refererOrigin === allowedOrigin || 
               refererOrigin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
      });

      if (!isRefererAllowed) {
        this.securityLogger.logOriginViolation('', referer, ip);
        throw new ForbiddenException(`Referer not allowed: ${refererOrigin}`);
      }

      // Additional security: Check for suspicious referer patterns
      this.checkForSuspiciousReferer(referer, ip);

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Referer validation failed');
    }
  }

  private checkForSuspiciousReferer(referer: string, ip: string): void {
    // Check for common malicious patterns
    const suspiciousPatterns = [
      /data:/i,           // data URLs
      /javascript:/i,      // javascript URLs  
      /file:/i,           // file URLs
      /ftp:/i,            // ftp URLs
      /about:/i,          // about URLs
      /chrome:/i,         // chrome URLs
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(referer)) {
        this.securityLogger.logSuspiciousActivity(ip, 'Suspicious referer pattern', referer);
        throw new ForbiddenException('Suspicious referer pattern detected');
      }
    }

    // Check for excessively long referers (potential attack vector)
    if (referer.length > 2048) {
      this.securityLogger.logSuspiciousActivity(ip, 'Oversized referer header', referer.substring(0, 100) + '...');
      throw new ForbiddenException('Referer header too long');
    }
  }
}