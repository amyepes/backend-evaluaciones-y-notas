import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User as UserPrisma, Role, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';

// Definimos un tipo para el usuario sin la contraseña, para una mayor seguridad.
// Incluimos las relaciones que existen en el esquema.
type UserWithoutPassword = Omit<UserPrisma, 'password'> & {
  studentSubject?: Prisma.StudentSubjectDefaultArgs;
  califications?: Prisma.CalificationDefaultArgs;
  subjects?: Prisma.SubjectDefaultArgs;
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneUser(username: string): Promise<UserPrisma | null | undefined> {
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

  async createUser(body: CreateUserDto): Promise<Omit<UserPrisma, 'password'> | undefined> {
    try {
      const validation = await this.prisma.user.findFirst({
        where: {
          username: body.username,
        },
      });
      if (validation) throw new BadRequestException('Este usuario ya está en uso');

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(body.password, salt);

      const newUser = await this.prisma.user.create({
        data: {
          name: body.name,
          username: body.username,
          password: hash,
          role: body.role || Role.STUDENT, // El rol por defecto es STUDENT
        },
      });

      // Desestructuramos el objeto para eliminar la contraseña antes de devolverlo.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(userId: number): Promise<UserWithoutPassword | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          studentSubject: true,
          califications: true,
          subjects: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Desestructuramos el objeto para eliminar la contraseña y devolvemos el resultado tipado.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserWithoutPassword;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getAllUsers(query: UserQueryDto) {
    try {
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {};
      
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
        }),
        this.prisma.user.count({ where }),
      ]);

      const formattedUsers = users.map(({ _count, ...rest }) => ({
        ...rest,
        subjectsCount: _count.subjects,
        studentSubjectCount: _count.studentSubject,
        calificationsCount: _count.califications,
      }));

      return {
        users: formattedUsers,
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

  async updateUser(id: number, body: UpdateUserDto): Promise<Omit<UserPrisma, 'password'> | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (body.username && body.username !== user.username) {
        const existingUser = await this.prisma.user.findUnique({
          where: { username: body.username },
        });
        if (existingUser) {
          throw new BadRequestException('Este nombre de usuario ya está en uso');
        }
      }

      const updateData: Partial<Prisma.UserUpdateInput> = {
        ...body,
      };

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

  async deleteUser(id: number): Promise<{ message: string } | undefined> {
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

      // Eliminamos la validación de 'contacts' ya que no existe en el esquema.
      // Verificamos si tiene datos relacionados para evitar la eliminación en cascada accidental.
      if (user.subjects.length > 0 || user.studentSubject.length > 0 || user.califications.length > 0) {
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

  async getUserStats() {
    try {
      const [totalUsers, studentCount, professorCount, adminCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: Role.STUDENT } }),
        this.prisma.user.count({ where: { role: Role.PROFESSOR } }),
        this.prisma.user.count({ where: { role: Role.ADMIN } }),
      ]);

      const recentUsers = await this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });

      return {
        totalUsers,
        usersByRole: {
          students: studentCount,
          professors: professorCount,
          admins: adminCount,
        },
        recentUsers,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUserWithRelations(id: number): Promise<UserWithoutPassword | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          studentSubject: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                },
              },
            },
          },
          califications: {
            include: {
              quiz: {
                include: {
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
          subjects: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              _count: {
                select: {
                  studentSubject: true,
                  quizzes: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserWithoutPassword;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async changeUserPassword(id: number, newPassword: string): Promise<{ message: string } | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
