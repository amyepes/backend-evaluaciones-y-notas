import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { IRequestAuth } from 'src/auth/request-auth';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAll(@Request() req: IRequestAuth) {
    return await this.contactService.getAllContactsByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.contactService.getContactById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req: IRequestAuth, @Body() body: CreateContactDto) {
    return await this.contactService.createContact(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async editContact(@Param('id', ParseIntPipe) id: number, @Body() body: CreateContactDto){
    return await this.contactService.updateContact(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteContact(@Param('id', ParseIntPipe) id: number){
    return await this.contactService.deleteContact(id);
  }
}
