import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import { AuthMiddleware } from './auth/auth.middleware';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg =
                typeof message === 'object' ? JSON.stringify(message) : message;
              return `[${timestamp}] ${level}: ${msg}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'application.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg =
                typeof message === 'object' ? JSON.stringify(message) : message;
              return `[${timestamp}] ${level}: ${msg}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'application.log',
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg =
                typeof message === 'object' ? JSON.stringify(message) : message;
              return `[${timestamp}] ${level}: ${msg}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'application.log',
          level: 'warn',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg =
                typeof message === 'object' ? JSON.stringify(message) : message;
              return `[${timestamp}] ${level}: ${msg}`;
            }),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/auth/login', method: RequestMethod.POST },
        { path: '/api/auth/register', method: RequestMethod.POST },
      )
      .forRoutes('/api/*path');
  }
}
