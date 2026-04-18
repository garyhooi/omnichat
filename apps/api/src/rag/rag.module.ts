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
      useFactory: async (config: ConfigService, prisma: PrismaService) => {
        const provider = config.get<string>('DATABASE_PROVIDER', 'mongodb');
        let store: MongoDBVectorStore | PostgreSQLVectorStore | MySQLVectorStore;
        switch (provider) {
          case 'postgresql':
          case 'postgres':
            store = new PostgreSQLVectorStore(prisma);
            break;
          case 'mysql':
            store = new MySQLVectorStore(prisma);
            break;
          case 'mongodb':
          case 'mongo':
          default:
            store = new MongoDBVectorStore(prisma);
            break;
        }
        // Call onModuleInit if the store implements it (e.g. auto-create vector index)
        if ('onModuleInit' in store && typeof store.onModuleInit === 'function') {
          await store.onModuleInit();
        }
        return store;
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
