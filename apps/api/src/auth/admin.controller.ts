import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    return this.authService.getAdminUsers();
  }
}
