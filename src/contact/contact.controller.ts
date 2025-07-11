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
import { ContactService } from './contact.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { JwtAuthGuard } from 'src/common/auth/auth.guard';
import { Auth } from 'src/common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/contacts')
@UseInterceptors(ResponseInterceptor)
export class ContactController {
  constructor(
    private contactService: ContactService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async postContact(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.info('POST /api/contacts');
    const result = await this.contactService.createContact(request, user.id);

    return result;
  }

  @Get()
  async getContacts(): Promise<ContactResponse> {
    this.logger.info('GET /api/contacts');
    const result = await this.contactService.findAllContact();

    return result;
  }

  @Get('/:id')
  async getContactById(@Param('id') id: string): Promise<ContactResponse> {
    this.logger.info(`GET /api/contact/${id}`);
    const result = await this.contactService.findByIdContact(id);

    return result;
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateContactById(
    @Auth() user: User,
    @Param('id') id: string,
    @Body() request: Partial<UpdateContactRequest>,
  ): Promise<ContactResponse> {
    this.logger.info(`PATCH /api/contact/${id}`);
    const result = this.contactService.updateByIdContact(id, user.id, request);

    return result;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteContactById(@Param('id') id: string): Promise<boolean> {
    this.logger.info(`DELETE /api/contact/${id}`);
    const result = this.contactService.deleteByIdContact(id);

    return result;
  }
}
