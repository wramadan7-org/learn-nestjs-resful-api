import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);

        if (payload) {
          req.user = payload;
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    next();
  }
}
