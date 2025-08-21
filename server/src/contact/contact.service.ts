import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ContactEntity } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllContactsByUser(
    userId: number,
  ): Promise<ContactEntity[] | undefined> {
    try {
      const contacts = await this.prisma.contact.findMany({
        where: {
          userId,
        },
      });
      return contacts;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getContactById(contactId: number): Promise<ContactEntity | undefined> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          id: contactId,
        },
      });
      if (!contact) throw new NotFoundException('Contact not found');
      return contact;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async createContact(
    userId: number,
    body: CreateContactDto,
  ): Promise<ContactEntity | undefined> {
    try {
      const newContact = await this.prisma.contact.create({
        data: {
          name: body.name,
          lastname: body.lastname,
          email: body.email,
          phone: body.phone,
          address: body.address,
          userId,
        },
      });
      return newContact;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async updateContact(
    contactId: number,
    body: CreateContactDto,
  ): Promise<ContactEntity | undefined> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          id: contactId,
        },
      });
      if (!contact) throw new NotFoundException('Contact not found');
      const updatedContact = await this.prisma.contact.update({
        where: {
          id: contactId,
        },
        data: {
          name: body.name,
          lastname: body.lastname,
          email: body.email,
          phone: body.phone,
          address: body.address,
        },
      });
      return updatedContact;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async deleteContact(contactId: number): Promise<ContactEntity | undefined> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: {
          id: contactId,
        },
      });
      if (!contact) throw new NotFoundException('Contact not found');
      const deletedContact = await this.prisma.contact.delete({
        where: {
          id: contactId,
        },
      });
      return deletedContact;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
