import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
