import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status: number;
    let message: string | string[];
    let error: string;

    // 📌 Zod validation error
    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`,
      );
      error = 'Validation Error';
    }

    // 📌 Prisma known error
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'A record with this value already exists.';
          error = 'Conflict';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'The requested resource was not found.';
          error = 'Not Found';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid reference to another resource.';
          error = 'Bad Request';
          break;
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'Input value is too long for the field.';
          error = 'Bad Request';
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = 'Related record not found.';
          error = 'Bad Request';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database error.';
          error = 'Bad Request';
      }
    }

    // 📌 Prisma validation error (e.g. wrong types)
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid input data.';
      error = 'Validation Error';
    }

    // 📌 Prisma connection/init/rust panic errors
    else if (
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError
    ) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unexpected server error occurred.';
      error = 'Internal Server Error';
    }

    // 📌 NestJS HttpException (e.g. throw new NotFoundException())
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

    // 📌 Unhandled errors (e.g. throw new Error())
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception?.message || 'Internal server error';
      error = 'Internal Server Error';
    }

    // Final response
    res.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
