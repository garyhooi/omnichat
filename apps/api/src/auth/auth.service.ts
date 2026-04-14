import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new admin user.
   * Password is hashed using Argon2 (memory-hard, resistant to GPU/ASIC attacks).
   */
  async register(username: string, password: string, displayName: string) {
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
      },
    });

    return this.generateToken(user);
  }

  /**
   * Authenticate an admin user and return a JWT.
   * Password is verified against Argon2 hash.
   */
  async login(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password against Argon2 hash
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  /**
   * Validate a JWT payload and return the user. Used by the Socket.io
   * handshake guard to authenticate WebSocket connections.
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(user: { id: string; username: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
