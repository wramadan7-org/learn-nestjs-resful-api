import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserRequest, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { User } from '@prisma/client';
import { ValidationService } from 'src/common/validation/validation.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async findById(id: string): Promise<UserResponse> {
    this.logger.info(`Find user with ID ${id}`);

    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  async findCurrent(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async updateUser(
    id: string,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.password) {
      const hashPassword = await bcrypt.hash(updateRequest.password, 10);

      updateRequest.password = hashPassword;
    }

    let user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
