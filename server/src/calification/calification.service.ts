/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';
import { CalificationQueryDto } from './dto/calification-query.dto';

@Injectable()
export class CalificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCalifications(query: CalificationQueryDto) {
    try {
      const page = Math.max(1, parseInt(query.page || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
      const skip = (page - 1) * limit;

      const where: Record<string, any> = {};
      
      if (query.studentId) {
        where.studentId = parseInt(query.studentId);
      }

      if (query.quizId) {
        where.quizId = parseInt(query.quizId);
      }

      if (query.subjectId) {
        where.quiz = {
          subjectId: parseInt(query.subjectId)
        };
      }

      const [califications, total] = await Promise.all([
        this.prisma.calification.findMany({
          where,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            quiz: {
              select: {
                id: true,
                name: true,
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
          },
          orderBy: { id: 'desc' },
        }),
        this.prisma.calification.count({ where }),
      ]);

      return {
        califications,
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
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getCalificationById(id: number) {
    try {
      const calification = await this.prisma.calification.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          quiz: {
            select: {
              id: true,
              name: true,
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
        },
      });

      if (!calification) throw new NotFoundException('Calificación no encontrada');
      
      return calification;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async createCalification(createCalificationDto: CreateCalificationDto) {
    try {
      // Verify student exists
      const student = await this.prisma.user.findUnique({
        where: { id: createCalificationDto.studentId },
      });

      if (!student) {
        throw new BadRequestException('Estudiante no encontrado');
      }

      if (student.role !== 'STUDENT') {
        throw new BadRequestException('El usuario no es un estudiante');
      }

      // Verify quiz exists
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: createCalificationDto.quizId },
        include: {
          subject: true,
        },
      });

      if (!quiz) {
        throw new BadRequestException('Evaluación no encontrada');
      }

      // Check if student is enrolled in the subject
      const enrollment = await this.prisma.studentSubject.findFirst({
        where: {
          studentId: createCalificationDto.studentId,
          subjectId: quiz.subject.id,
        },
      });

      if (!enrollment) {
        throw new BadRequestException('El estudiante no está inscrito en esta materia');
      }

      // Check if calification already exists
      const existingCalification = await this.prisma.calification.findFirst({
        where: {
          studentId: createCalificationDto.studentId,
          quizId: createCalificationDto.quizId,
        },
      });

      if (existingCalification) {
        throw new BadRequestException('Ya existe una calificación para este estudiante en esta evaluación');
      }

      const calification = await this.prisma.calification.create({
        data: {
          studentId: createCalificationDto.studentId,
          quizId: createCalificationDto.quizId,
          grade: createCalificationDto.grade,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
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
      });

      return calification;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async updateCalification(id: number, updateCalificationDto: UpdateCalificationDto) {
    try {
      const calification = await this.prisma.calification.findUnique({
        where: { id },
      });
      
      if (!calification) throw new NotFoundException('Calificación no encontrada');

      const updatedCalification = await this.prisma.calification.update({
        where: { id },
        data: updateCalificationDto,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
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
      });

      return updatedCalification;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async deleteCalification(id: number): Promise<{ message: string }> {
    try {
      const calification = await this.prisma.calification.findUnique({
        where: { id },
      });

      if (!calification) throw new NotFoundException('Calificación no encontrada');

      await this.prisma.calification.delete({
        where: { id },
      });

      return { message: 'Calificación eliminada exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getCalificationsByQuiz(quizId: number) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          subject: {
            include: {
              professor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!quiz) {
        throw new NotFoundException('Evaluación no encontrada');
      }

      const califications = await this.prisma.calification.findMany({
        where: { quizId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          student: {
            name: 'asc',
          },
        },
      });

      return {
        quiz,
        califications,
        totalCalifications: califications.length,
        averageGrade: califications.length > 0 
          ? Math.round((califications.reduce((sum, c) => sum + c.grade, 0) / califications.length) * 100) / 100
          : 0,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getCalificationStats() {
    try {
      const [totalCalifications, averageGrade, gradeDistribution] = await Promise.all([
        this.prisma.calification.count(),
        this.prisma.calification.aggregate({
          _avg: {
            grade: true,
          },
        }),
        this.prisma.calification.groupBy({
          by: ['grade'],
          _count: {
            grade: true,
          },
          orderBy: {
            grade: 'asc',
          },
        }),
      ]);

      const passedGrades = await this.prisma.calification.count({
        where: {
          grade: {
            gte: 70,
          },
        },
      });

      const failedGrades = totalCalifications - passedGrades;

      return {
        totalCalifications,
        averageGrade: averageGrade._avg.grade ? Math.round(averageGrade._avg.grade * 100) / 100 : 0,
        passedGrades,
        failedGrades,
        passRate: totalCalifications > 0 ? Math.round((passedGrades / totalCalifications) * 100) : 0,
        gradeDistribution,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
