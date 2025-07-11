import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { toCamelCase, toSnakeCase } from 'src/common/utils/case-converter.util';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  async createContact(
    request: CreateContactRequest,
    userId: string,
  ): Promise<ContactResponse> {
    this.logger.info(`createContact ${JSON.stringify({ ...request, userId })}`);
    const contactRequest: CreateContactRequest =
      this.validationService.validate(
        ContactValidation.CreateContactSchema,
        request,
      );

    try {
      const contact = await this.prismaService.contact.create({
        data: {
          first_name: contactRequest.firstName,
          last_name: contactRequest.lastName,
          email: contactRequest.email,
          phone: contactRequest.phone,
          user_id: userId,
        },
      });

      return toCamelCase(contact);
    } catch (error) {
      throw error;
    }
  }

  async findAllContact(): Promise<ContactResponse> {
    this.logger.info('findAllContact');
    const contacts = await this.prismaService.contact.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        user_id: true,
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return toCamelCase(contacts);
  }

  async findByIdContact(id: string): Promise<ContactResponse> {
    this.logger.info(`findByIdContact ${id}`);
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        user_id: true,
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    if (!contact) throw new NotFoundException('Contact not found');

    return toCamelCase(contact);
  }

  async updateByIdContact(
    id: string,
    userId: string,
    request: Partial<UpdateContactRequest>,
  ): Promise<ContactResponse> {
    this.logger.info(
      `updateByIdContact with ID: ${id}, userId: ${userId}, request: ${JSON.stringify(request)}`,
    );
    const updateRequest = this.validationService.validate(
      ContactValidation.UpdateContactSchema,
      request,
    );

    this.logger.info(`${JSON.stringify(toSnakeCase(updateRequest))}`);

    try {
      const contact = await this.prismaService.contact.update({
        where: {
          id,
          user_id: userId,
        },
        data: toSnakeCase(updateRequest),
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          user_id: true,
          user: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      });

      return toCamelCase(contact);
    } catch (error) {
      throw error;
    }
  }

  async deleteByIdContact(id: string): Promise<boolean> {
    this.logger.info(`deleteByIdContact with ID: ${id}`);

    try {
      await this.prismaService.contact.delete({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
