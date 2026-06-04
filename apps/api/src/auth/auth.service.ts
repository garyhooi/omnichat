import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';
import { SecurityLoggerService } from '../common/security-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly securityLogger: SecurityLoggerService,
  ) {}

  /** Register a new admin user using Argon2 (memory-hard, resistant to GPU/ASIC attacks). */
  async register(
    username: string,
    password: string,
    displayName: string,
    ip?: string,
    userAgent?: string,
    origin?: string,
  ) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { username },
    });
    if (existing) {
      throw new ConflictException('Username already registered');
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const userCount = await this.prisma.adminUser.count();
    const role = userCount === 0 ? 'developer' : 'agent';

    const user = await this.prisma.adminUser.create({
      data: {
        username,
        passwordHash,
        displayName,
        role,
        registrationIp: ip,
        userAgent,
      },
    });

    return this.generateBearerTokens(user, origin);
  }

  /** Authenticate an admin user and return a JWT. */
  async login(username: string, password: string, ip?: string, userAgent?: string, origin?: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isLocked) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'Account locked');
      throw new UnauthorizedException('Account is locked. Please contact an administrator.');
    }

    this.securityLogger.logAuthAttempt(username, true, ip || 'unknown');

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: {
        lastLoginIp: ip,
        userAgent,
      },
    });

    return this.generateBearerTokens(user, origin);
  }

  /** Generate bearer-mode tokens: accessToken + refreshToken + siteToken. */
  async generateBearerTokens(user: { id: string; username: string; role: string }, origin?: string) {
    const accessTokenExpiry = this.config.get<string>('ACCESS_TOKEN_EXPIRY', '30m');
    const refreshTokenExpiry = this.config.get<string>('REFRESH_TOKEN_EXPIRY', '7d');

    const jti = crypto.randomUUID();
    const accessPayload: any = {
      sub: user.id,
      username: user.username,
      role: user.role,
      jti,
      boundOrigin: origin || null,
    };

    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: accessTokenExpiry });

    const accessExpiresMs = parseDuration(accessTokenExpiry);
    const expiresAt = new Date(Date.now() + accessExpiresMs);

    await this.prisma.session.create({
      data: {
        jti,
        adminUserId: user.id,
        expiresAt,
      },
    });

    const refreshToken = crypto.randomUUID();
    const refreshTokenHash = this.hashToken(refreshToken);
    const refreshExpiresAt = new Date(Date.now() + parseDuration(refreshTokenExpiry));

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        adminUserId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    const siteToken = this.jwtService.sign(
      { sub: user.id, origin: origin || null, type: 'site-token' },
      { expiresIn: accessTokenExpiry },
    );

    return {
      accessToken,
      refreshToken,
      siteToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  /** Refresh an access token using a valid refresh token. */
  async refreshAccessToken(refreshToken: string, origin?: string) {
    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await this.prisma.adminUser.findUnique({
      where: { id: stored.adminUserId },
    });

    if (!user || user.isLocked) {
      throw new UnauthorizedException('User not found or locked');
    }

    return this.generateBearerTokens(user, origin);
  }

  /** Revoke all refresh tokens for a user. */
  async revokeRefreshTokens(adminUserId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        adminUserId,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  /** Validate a JWT payload and return the user. */
  async validateToken(token: string, origin?: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload & { boundOrigin?: string }>(token);
      if (!payload.jti) {
        throw new UnauthorizedException('Invalid token: missing jti');
      }

      if (payload.boundOrigin && origin) {
        if (!originMatches(payload.boundOrigin, origin)) {
          throw new UnauthorizedException('Token origin mismatch');
        }
      }

      const session = await this.prisma.session.findUnique({
        where: { jti: payload.jti },
      });

      if (!session || session.revoked || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired or revoked');
      }

      const user = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.isLocked) {
        throw new UnauthorizedException('Account is locked');
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName,
        jti: payload.jti,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateVisitorToken(existingVisitorId?: string): { token: string; visitorId: string } {
    const visitorId = existingVisitorId || `v_${crypto.randomUUID()}`;
    const jti = crypto.randomUUID();
    const payload: any = { sub: visitorId, type: 'visitor', jti };
    const token = this.jwtService.sign(payload, { issuer: 'omnichat', expiresIn: '30d' });
    return { token, visitorId };
  }

  validateVisitorToken(token: string): { visitorId: string } {
    const payload = this.jwtService.verify<{ sub: string; type: string }>(token);
    if (payload.type !== 'visitor') {
      throw new UnauthorizedException('Invalid token type');
    }
    return { visitorId: payload.sub };
  }

  /** Verify an external site JWT (widget visitor flow) and extract claims. */
  verifyExternalSiteJwt(token: string): { sub: string; username: string; operatorName: string } {
    const secret = this.config.get<string>('EXTERNAL_SITE_JWT_SECRET', '');
    if (!secret) {
      throw new UnauthorizedException('External site JWT secret not configured');
    }
    try {
      const payload = this.jwtService.verify<{
        sub: string;
        username: string;
        operatorName: string;
        iat: number;
        exp: number;
      }>(token, { secret });
      return {
        sub: payload.sub,
        username: payload.username,
        operatorName: payload.operatorName,
      };
    } catch {
      throw new UnauthorizedException('Invalid external site token');
    }
  }

  async logout(jti: string) {
    await this.prisma.session.update({
      where: { jti },
      data: { revoked: true },
    });
  }

  async getAdminUsers() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        isOnline: true,
        lastSeenAt: true,
      },
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

function parseDuration(d: string): number {
  const match = d.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 30 * 60 * 1000;
  const val = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return val * 1000;
    case 'm': return val * 60 * 1000;
    case 'h': return val * 60 * 60 * 1000;
    case 'd': return val * 24 * 60 * 60 * 1000;
    default: return 30 * 60 * 1000;
  }
}

function originMatches(bound: string, incoming: string): boolean {
  try {
    const boundHost = new URL(bound).hostname;
    const incomingHost = new URL(incoming).hostname;
    return boundHost === incomingHost;
  } catch {
    return bound === incoming;
  }
}
