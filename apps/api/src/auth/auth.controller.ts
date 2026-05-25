import { Body, Controller, Get, Post, Req, UseGuards, Request, Ip, Headers, Res } from '@nestjs/common';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import { AdminIpAllowlistGuard } from './admin-ip-allowlist.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Request as ExpressReq } from 'express';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';


export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(AdminIpAllowlistGuard, AdminApiKeyGuard)
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto.username, dto.password, dto.displayName, ip, userAgent);
    res.cookie('omnichat_auth_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    return result;
  }

  @Post('login')
  @UseGuards(AdminIpAllowlistGuard, AdminApiKeyGuard)
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.username, dto.password, ip, userAgent);
    res.cookie('omnichat_auth_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    return result;
  }

  @Post('logout')
  @UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.user && req.user.jti) {
      await this.authService.logout(req.user.jti);
    }
    res.clearCookie('omnichat_auth_token');
    return { success: true };
  }

  @Post('visitor')
  async visitorSession(
    @Body() body: { visitorId?: string },
    @Req() req: ExpressReq,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Reuse existing visitorId if valid cookie already present (prevents new ID on refresh)
    let visitorId = body.visitorId;
    if (req.cookies?.['omnichat_visitor_token']) {
      try {
        const v = this.authService.validateVisitorToken(req.cookies['omnichat_visitor_token']);
        visitorId = v.visitorId;
      } catch { /* expired/invalid, use body.visitorId or generate new */ }
    }
    const result = this.authService.generateVisitorToken(visitorId);
    res.cookie('omnichat_visitor_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
