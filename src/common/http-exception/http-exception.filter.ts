import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(HttpException, ZodError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status: number;
    let message: string | string[];
    let error: string;

    // Zod validation error
    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      error = 'Bad Request';
    }
    // NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
        error = exception.name;
      } else if (typeof response === 'object') {
        const resObj = response as any;
        message = resObj.message || resObj.error || exception.message;
        error = resObj.error || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    }
    // Unhandled exception
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = 'Internal Server Error';
    }

    res.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
