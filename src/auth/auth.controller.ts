import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  LoginUserRequest,
  RefreshTokenUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';
import { JwtAuthGuard } from 'src/common/auth/auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('/api/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Post('/register')
  async register(@Body() request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info('POST /api/auth/register');
    const result = await this.authService.register(request);

    return result;
  }

  @Post('/login')
  async login(@Body() request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info('POST /api/auth/login');
    const result = await this.authService.login(request);

    return result;
  }

  @Post('/refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(
    @Body() request: RefreshTokenUserRequest,
  ): Promise<UserResponse> {
    this.logger.info('POST /api/auth/refresh');
    const result = await this.authService.refreshAccessToken(request);

    return result;
  }
}
