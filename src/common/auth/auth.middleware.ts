import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization'] as string;

    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
