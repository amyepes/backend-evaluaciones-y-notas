import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import type { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneUser(username: string): Promise<UserEntity | null | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (user) return user;
      return null;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async createUser(body: CreateUserDto): Promise<UserEntity | undefined> {
    try {
      const validation = await this.prisma.user.findFirst({
        where: {
          username: body.username,
        },
      });
      if (validation) throw new BadRequestException('Este usuario ya está en uso');
      //..
      const salt = await bcrypt.genSalt()
      const hash = await bcrypt.hash(body.password, salt)
      const newUser = await this.prisma.user.create({
        data: {
          name: body.name,
          username: body.username,
          password: hash,
          role: body.role || Role.STUDENT, // Default role is STUDENT
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if(error instanceof BadRequestException)
        throw new BadRequestException(error.message)
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          contacts: true,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {password, ...result} = user
      return result
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getAllUsers(query: UserQueryDto) {
    try {
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { username: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      if (query.role) {
        where.role = query.role;
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                contacts: true,
                subjects: true,
                studentSubject: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<UserEntity | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) throw new NotFoundException('Usuario no encontrado');

      // Check if username is being updated and if it's already taken
      if (body.username && body.username !== user.username) {
        const existingUser = await this.prisma.user.findUnique({
          where: { username: body.username },
        });
        if (existingUser) {
          throw new BadRequestException('Este nombre de usuario ya está en uso');
        }
      }

      const updateData: any = {
        ...body,
      };

      // Hash password if it's being updated
      if (body.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(body.password, salt);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          contacts: true,
          subjects: true,
          studentSubject: true,
          califications: true,
        },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      // Check if user has related data
      if (user.contacts.length > 0 || user.subjects.length > 0 || 
          user.studentSubject.length > 0 || user.califications.length > 0) {
        throw new BadRequestException(
          'No se puede eliminar el usuario porque tiene datos relacionados'
        );
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUsersByRole(role: Role) {
    try {
      const users = await this.prisma.user.findMany({
        where: { role },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          createdAt: true,
        },
        orderBy: { name: 'asc' },
      });

      return users;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
