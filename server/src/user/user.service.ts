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
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneUser(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
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
          subjects: true,
          studentSubject: true,
          califications: true,
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
      const page = Math.max(1, parseInt(query.page || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
      const skip = (page - 1) * limit;

      const where: Record<string, any> = {};
      
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
                subjects: true,
                studentSubject: true,
                califications: true,
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
          hasNext: page * limit < total,
          hasPrev: page > 1,
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

      const updateData: Record<string, any> = {
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
          subjects: true,
          studentSubject: true,
          califications: true,
        },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      // Check if user has related data
      if (user.subjects.length > 0 || 
          user.studentSubject.length > 0 || user.califications.length > 0) {
        throw new BadRequestException(
          'No se puede eliminar el usuario porque tiene datos relacionados (materias, inscripciones o calificaciones)'
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
      throw new InternalServerErrorException('Error interno del servidor');
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

  async getUserStats() {
    try {
      const [totalUsers, adminCount, professorCount, studentCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: Role.ADMIN } }),
        this.prisma.user.count({ where: { role: Role.PROFESSOR } }),
        this.prisma.user.count({ where: { role: Role.STUDENT } }),
      ]);

      return {
        total: totalUsers,
        byRole: {
          admin: adminCount,
          professor: professorCount,
          student: studentCount,
        },
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async changeUserPassword(id: number, newPassword: string): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getUserWithRelations(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          subjects: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
          studentSubject: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  professor: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          califications: {
            include: {
              quiz: {
                select: {
                  id: true,
                  name: true,
                  subject: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
