import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy } from 'src/common/auth/auth.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_ACCESS,
      signOptions: { expiresIn: process.env.JWT_EXPIRED_ACCESS },
    }),
  ],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
