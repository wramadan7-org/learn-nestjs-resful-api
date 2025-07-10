import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const Auth = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  if (!user || !user.id || typeof user.id !== 'string') {
    throw new UnauthorizedException('Invalid or missing token');
  }

  return user;
});
