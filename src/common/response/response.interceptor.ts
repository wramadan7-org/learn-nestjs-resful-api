import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        if (result && typeof result === 'object' && 'message' in result) {
          const { message, data } = result;

          return {
            statusCode,
            message: message || 'Success',
            data: data ?? null,
          };
        }

        return {
          statusCode,
          message: 'Success',
          data: result,
        };
      }),
    );
  }
}
