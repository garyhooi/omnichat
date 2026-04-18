import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VECTOR_STORE_PROVIDER } from './vector-store.interface';
import { MongoDBVectorStore } from './mongodb-vector.store';
import { PostgreSQLVectorStore } from './postgresql-vector.store';
import { MySQLVectorStore } from './mysql-vector.store';
import { RagService } from './rag.service';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [
    {
      provide: VECTOR_STORE_PROVIDER,
      useFactory: (config: ConfigService, prisma: PrismaService) => {
        const provider = config.get<string>('DATABASE_PROVIDER', 'mongodb');
        switch (provider) {
          case 'postgresql':
          case 'postgres':
            return new PostgreSQLVectorStore(prisma);
          case 'mysql':
            return new MySQLVectorStore(prisma);
          case 'mongodb':
          case 'mongo':
          default:
            return new MongoDBVectorStore(prisma);
        }
      },
      inject: [ConfigService, PrismaService],
    },
    RagService,
    DocumentService,
  ],
  controllers: [DocumentController],
  exports: [RagService, DocumentService, VECTOR_STORE_PROVIDER],
})
export class RagModule {}
