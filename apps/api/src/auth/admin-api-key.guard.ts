import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

/**
 * Guard that verifies the request contains a valid admin API key
 * in the Authorization header as "Bearer <ADMIN_API_KEY>".
 *
 * This is used in addition to (not instead of) JWT auth + role checks
 * for admin-only endpoints.
 */
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const adminApiKey = process.env.ADMIN_API_KEY;
    if (!adminApiKey) {
      throw new UnauthorizedException('Admin API key not configured on server');
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['x-admin-api-key'] as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('Missing admin API key');
    }

    // Use timing-safe comparison to prevent timing attacks
    const a = Buffer.from(authHeader);
    const b = Buffer.from(adminApiKey);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
