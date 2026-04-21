import { Global, Module } from '@nestjs/common';
import { AdminIpAllowlistGuard } from './admin-ip-allowlist.guard';
import { AdminIpAllowlistService } from './admin-ip-allowlist.service';

@Global()
@Module({
  providers: [AdminIpAllowlistService, AdminIpAllowlistGuard],
  exports: [AdminIpAllowlistService, AdminIpAllowlistGuard],
})
export class AdminSecurityModule {}
