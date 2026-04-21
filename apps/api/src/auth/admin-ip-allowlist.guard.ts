import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminIpAllowlistService } from './admin-ip-allowlist.service';

@Injectable()
export class AdminIpAllowlistGuard implements CanActivate {
  constructor(private readonly adminIpAllowlistService: AdminIpAllowlistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = this.adminIpAllowlistService.extractRequestIp(request);
    await this.adminIpAllowlistService.assertIpAllowed(ip);
    return true;
  }
}
