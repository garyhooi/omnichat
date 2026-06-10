import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const LOG_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    await this.ensureLogTtlIndexes();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async ensureLogTtlIndexes(): Promise<void> {
    try {
      // Check if this is MongoDB by attempting $runCommandRaw
      await this.$runCommandRaw({
        ping: 1,
      });
    } catch {
      // Not MongoDB — skip TTL index creation (SQL doesn't support TTL indexes)
      return;
    }

    const collections = ['httpLog', 'aiLog', 'toolLog'];
    for (const collection of collections) {
      try {
        await this.$runCommandRaw({
          createIndexes: collection,
          indexes: [
            {
              key: { createdAt: 1 },
              name: 'createdAt_ttl',
              expireAfterSeconds: LOG_TTL_SECONDS,
            },
          ],
        });
      } catch (err: any) {
        // Index may already exist or collection doesn't exist yet — ignore
      }
    }
  }
}
