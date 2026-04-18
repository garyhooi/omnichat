import { Body, Controller, Get, Post, UseGuards, Request, Ip, Headers, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.user && req.user.jti) {
      await this.authService.logout(req.user.jti);
    }
    res.clearCookie('omnichat_auth_token');
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: any) {
    return {
      user: {
        id: req.user.sub,
        username: req.user.username,
        displayName: req.user.displayName || req.user.username,
        role: req.user.role || 'admin',
      },
    };
  }
}
