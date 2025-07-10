import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';

@Controller('/api/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() request: RegisterUserRequest): Promise<UserResponse> {
    const result = await this.authService.register(request);

    return result;
  }

  @Post('/login')
  async login(@Body() request: LoginUserRequest): Promise<UserResponse> {
    const result = await this.authService.login(request);

    return result;
  }
}
