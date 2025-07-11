import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequest, UserResponse } from 'src/model/user.model';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';
import { Auth } from 'src/common/auth/auth.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/auth/auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('/api/users')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Get('/current')
  async getCurrentUser(@Auth() user: User): Promise<UserResponse> {
    this.logger.info('GET /api/users/current');
    const result = await this.userService.findCurrent(user);

    return result;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    this.logger.info(`GET /api/users/${id}`);
    const result = await this.userService.findById(id);

    return result;
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<UserResponse> {
    this.logger.info(`PATCH /api/users/${id}`);
    const result = await this.userService.updateUser(id, request);

    return result;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUserById(@Param('id') id: string): Promise<boolean> {
    this.logger.info(`DELETE /api/users/${id}`);
    const result = await this.userService.deleteUser(id);

    return result;
  }
}
