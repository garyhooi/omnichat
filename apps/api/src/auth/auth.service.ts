import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly securityLogger: SecurityLoggerService,
  ) {}

  /**
   * Register a new admin user.
   * Password is hashed using Argon2 (memory-hard, resistant to GPU/ASIC attacks).
   */
  async register(
    username: string,
    password: string,
    displayName: string,
    ip?: string,
    userAgent?: string,
  ) {
    // Check if user already exists
    const existing = await this.prisma.adminUser.findUnique({
      where: { username },
    });
    if (existing) {
      throw new ConflictException('Username already registered');
    }

    // Hash password with Argon2
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });

    const user = await this.prisma.adminUser.create({
      data: {
        username,
        passwordHash,
        displayName,
        role: 'agent',
        registrationIp: ip,
        userAgent,
      },
    });

    return this.generateToken(user);
  }

  /**
   * Authenticate an admin user and return a JWT.
   * Password is verified against Argon2 hash.
   */
  async login(username: string, password: string, ip?: string, userAgent?: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password against Argon2 hash
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is locked
    if (user.isLocked) {
      this.securityLogger.logAuthAttempt(username, false, ip || 'unknown', 'Account locked');
      throw new UnauthorizedException('Account is locked. Please contact an administrator.');
    }

    this.securityLogger.logAuthAttempt(username, true, ip || 'unknown');

    // Update last login info
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: {
        lastLoginIp: ip,
        userAgent,
      },
    });

    return this.generateToken(user);
  }

  /**
   * Validate a JWT payload and return the user. Used by the Socket.io
   * handshake guard to authenticate WebSocket connections.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload.jti) {
        throw new UnauthorizedException('Invalid token: missing jti');
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

  async generateToken(user: { id: string; username: string; role: string }) {
    const jti = crypto.randomUUID();
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      jti,
    };

    const accessToken = this.jwtService.sign(payload);
    
    // Default expiration is 24 hours in auth.module.ts
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.session.create({
      data: {
        jti,
        adminUserId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
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
}
