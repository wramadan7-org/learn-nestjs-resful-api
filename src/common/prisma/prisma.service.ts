import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  onModuleInit() {
    this.$on('query', (e) => {
      this.logger.info(`Query: ${e.query} - Params: ${e.params}`);
    });

    this.$on('info', (e) => {
      this.logger.info(`Info: ${e.message}`);
    });

    this.$on('warn', (e) => {
      this.logger.warn(`Warning: ${e.message}`);
    });

    this.$on('error', (e) => {
      this.logger.error(`Error: ${e.message}`);
    });

    return super.$connect();
  }
}
