import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadTokenService } from './upload-token.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UploadController],
  providers: [UploadTokenService],
  exports: [UploadTokenService],
})
export class UploadModule {}
