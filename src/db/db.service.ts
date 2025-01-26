import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });

    this.$extends({
      result: {
        uniqueReadingInterval: {
          numOfReadPages: {
            needs: { startPage: true, endPage: true },
            compute(uniqueReadingInterval) {
              return (
                uniqueReadingInterval.endPage -
                uniqueReadingInterval.startPage +
                1
              );
            },
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
