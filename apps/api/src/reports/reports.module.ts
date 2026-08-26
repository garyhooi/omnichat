import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
