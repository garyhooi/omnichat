import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SiteTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return true;

    const siteToken = request.headers['x-external-site-token'];
    if (!siteToken) {
      throw new UnauthorizedException('Missing x-external-site-token header');
    }

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        origin: string;
        type: string;
      }>(siteToken);

      if (payload.type !== 'site-token') {
        throw new UnauthorizedException('Invalid site token type');
      }

      const requestOrigin = request.headers['origin'] || request.headers['referer'];
      if (payload.origin && requestOrigin) {
        try {
          const payloadHost = new URL(payload.origin).hostname;
          const requestHost = new URL(requestOrigin).hostname;
          if (payloadHost !== requestHost) {
            throw new UnauthorizedException('Site token origin mismatch');
          }
        } catch {
          if (payload.origin !== requestOrigin) {
            throw new UnauthorizedException('Site token origin mismatch');
          }
        }
      }

      const user = request.user;
      if (user && user.id && payload.sub !== user.id) {
        throw new UnauthorizedException('Site token subject mismatch');
      }

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid site token');
    }
  }
}
