import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadTokenService } from './upload-token.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [UploadTokenService],
  exports: [UploadTokenService],
})
export class UploadModule {}
