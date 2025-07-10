import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequest, UserResponse } from 'src/model/user.model';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';
import { Auth } from 'src/common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/current')
  async findCurrentUser(@Auth() user: User): Promise<UserResponse> {
    const result = await this.userService.findCurrent(user);

    return result;
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string): Promise<UserResponse> {
    const result = await this.userService.findById(id);

    return result;
  }

  @Patch('/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const result = await this.userService.updateUser(id, request);

    return result;
  }

  @Delete('/:id')
  async deleteUserById(@Param('id') id: string): Promise<boolean> {
    const result = await this.userService.deleteUser(id);

    return result;
  }
}
