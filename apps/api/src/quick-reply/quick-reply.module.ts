import { Module } from '@nestjs/common';
import { QuickReplyService } from './quick-reply.service';
import { QuickReplyController } from './quick-reply.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuickReplyService],
  controllers: [QuickReplyController]
})
export class QuickReplyModule {}
