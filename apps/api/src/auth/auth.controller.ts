import { Body, Controller, Get, Post, Req, UseGuards, Request, Ip, Headers, Res } from '@nestjs/common';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminIpAllowlistGuard } from './admin-ip-allowlist.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Request as ExpressReq } from 'express';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @IsNotEmpty() displayName: string;
}

export class LoginDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() password: string;
}

export class RefreshDto {
  @IsString() @IsNotEmpty() refreshToken: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(AdminIpAllowlistGuard, AdminApiKeyGuard)
  async register(
    @Body() dto: RegisterDto, @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('origin') origin: string,
    @Headers('x-forwarded-client-ip') forwardedClientIp: string,
  ) {
    const effectiveIp = forwardedClientIp || ip;
    return this.authService.register(dto.username, dto.password, dto.displayName, effectiveIp, userAgent, origin);
  }

  @Post('login')
  @UseGuards(AdminIpAllowlistGuard, AdminApiKeyGuard)
  async login(
    @Body() dto: LoginDto, @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('origin') origin: string,
    @Headers('x-forwarded-client-ip') forwardedClientIp: string,
  ) {
    const effectiveIp = forwardedClientIp || ip;
    return this.authService.login(dto.username, dto.password, effectiveIp, userAgent, origin);
  }

  @Post('refresh')
  @UseGuards(AdminIpAllowlistGuard)
  async refresh(
    @Body() dto: RefreshDto,
    @Headers('origin') origin: string,
  ) {
    return this.authService.refreshAccessToken(dto.refreshToken, origin);
  }

  @Post('logout')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async logout(@Request() req: any) {
    if (req.user && req.user.jti) {
      await this.authService.logout(req.user.jti);
    }
    if (req.user?.id) {
      await this.authService.revokeRefreshTokens(req.user.id);
    }
    return { success: true };
  }

  @Post('visitor')
  async visitorSession(
    @Body() body: { visitorId?: string; externalToken?: string },
    @Req() req: ExpressReq,
    @Res({ passthrough: true }) res: Response,
  ) {
    let visitorId = body.visitorId;
    if (req.cookies?.['omnichat_visitor_token']) {
      try {
        const v = this.authService.validateVisitorToken(req.cookies['omnichat_visitor_token']);
        visitorId = v.visitorId;
      } catch {}
    }

    const result = this.authService.generateVisitorToken(visitorId);
    res.cookie('omnichat_visitor_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return { visitorId: result.visitorId };
  }

  @Get('me')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async me(@Request() req: any) {
    return {
      user: {
        id: req.user.sub,
        username: req.user.username,
        displayName: req.user.displayName || req.user.username,
        role: req.user.role || 'agent',
      },
    };
  }
}
