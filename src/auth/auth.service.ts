import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import {
  LoginUserRequest,
  RefreshTokenUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info('Function service auth for register');
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(
        AuthValidation.RegisterUserSchema,
        request,
      );

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername !== 0)
      throw new HttpException('Username already exists', 400);

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info('Function service auth for login');

    const loginRequest: LoginUserRequest = this.validationService.validate(
      AuthValidation.LoginUserSchema,
      request,
    );

    let user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user)
      throw new UnauthorizedException('Username or password is invalid');

    const payloadAccessToken = {
      id: user.id,
      username: user.username,
      name: user.name,
      type: 'access',
    };

    const payloadRefreshToken = {
      id: user.id,
      username: user.username,
      name: user.name,
      type: 'refresh',
    };

    const accessToken = await this.jwtService.signAsync(payloadAccessToken);

    const refreshToken = await this.jwtService.signAsync(payloadRefreshToken, {
      expiresIn: process.env.JWT_EXPIRED_REFRESH,
      secret: process.env.JWT_SECRET_REFRESH,
    });

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Username or password is invalid');

    return {
      username: user.username,
      name: user.name || '',
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    request: RefreshTokenUserRequest,
  ): Promise<UserResponse> {
    this.logger.info('Function service auth for refresh token');
    const refreshRequest: RefreshTokenUserRequest =
      await this.validationService.validate(
        AuthValidation.RefreshTokenUserSchema,
        request,
      );

    let payload: UserResponse & { type: 'access' | 'refresh' };

    try {
      payload = await this.jwtService.verifyAsync(refreshRequest.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH,
      });

      if (payload.type !== 'refresh')
        throw new UnauthorizedException('Invalid token type');
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const payloadAccessToken = {
      id: user.id,
      username: user.username,
      name: user.name,
      type: 'access',
    };

    let newAccessToken: string;

    try {
      newAccessToken = await this.jwtService.signAsync(payloadAccessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      username: user.username,
      name: user.name,
      accessToken: newAccessToken,
    };
  }
}
