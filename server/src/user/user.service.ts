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

// =======================================================
// Patrón de Diseño: Abstract Factory
// =======================================================

// 1. Interfaz del Abstract Factory
// Define un contrato para la creación de los datos de usuario.
interface IAbstractUserFactory {
  createUser(data: CreateUserDto): Promise<Prisma.UserCreateInput>;
}

// 2. Fábricas Concretas
// Cada clase implementa la lógica de creación para un rol específico.
class StudentFactory implements IAbstractUserFactory {
  async createUser(data: CreateUserDto): Promise<Prisma.UserCreateInput> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    return {
      name: data.name,
      username: data.username,
      password: hash,
      role: Role.STUDENT,
    };
  }
}

class ProfessorFactory implements IAbstractUserFactory {
  async createUser(data: CreateUserDto): Promise<Prisma.UserCreateInput> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    return {
      name: data.name,
      username: data.username,
      password: hash,
      role: Role.PROFESSOR,
    };
  }
}

class AdminFactory implements IAbstractUserFactory {
  async createUser(data: CreateUserDto): Promise<Prisma.UserCreateInput> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    return {
      name: data.name,
      username: data.username,
      password: hash,
      role: Role.ADMIN,
    };
  }
}

// =======================================================
// UserService (El cliente del patrón)
// =======================================================

// Definimos un tipo para el usuario sin la contraseña, para una mayor seguridad.
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
      if (validation) {
        throw new BadRequestException('Este usuario ya está en uso');
      }

      // Elige la fábrica correcta según el rol del cuerpo.
      let factory: IAbstractUserFactory;
      switch (body.role) {
        case Role.STUDENT:
          factory = new StudentFactory();
          break;
        case Role.PROFESSOR:
          factory = new ProfessorFactory();
          break;
        case Role.ADMIN:
          factory = new AdminFactory();
          break;
        default:
          factory = new StudentFactory(); // Rol por defecto
          break;
      }

      // La fábrica crea y devuelve los datos del nuevo usuario, con la contraseña hasheada.
      const userData = await factory.createUser(body);

      const newUser = await this.prisma.user.create({
        data: userData,
      });

      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
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
