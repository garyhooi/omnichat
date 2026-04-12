import { Module } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { SiteConfigController } from './site-config.controller';

@Module({
  providers: [SiteConfigService],
  controllers: [SiteConfigController],
  exports: [SiteConfigService],
})
export class AppConfigModule {}
