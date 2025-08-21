/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizQueryDto } from './dto/quiz-query.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllQuizzes(query: QuizQueryDto) {
    try {
      const page = Math.max(1, parseInt(query.page || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
      const skip = (page - 1) * limit;

      const where: Record<string, any> = {};
      
      if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
      }

      if (query.subjectId) {
        where.subjectId = parseInt(query.subjectId);
      }

      const [quizzes, total] = await Promise.all([
        this.prisma.quiz.findMany({
          where,
          skip,
          take: limit,
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
            _count: {
              select: {
                califications: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.quiz.count({ where }),
      ]);

      return {
        quizzes,
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

  async getQuizById(id: number) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          subject: {
            include: {
              professor: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          califications: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          _count: {
            select: {
              califications: true,
            },
          },
        },
      });

      if (!quiz) throw new NotFoundException('Evaluación no encontrada');
      
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async createQuiz(createQuizDto: CreateQuizDto) {
    try {
      // Verify subject exists
      const subject = await this.prisma.subject.findUnique({
        where: { id: createQuizDto.subjectId },
      });

      if (!subject) {
        throw new BadRequestException('Materia no encontrada');
      }

      const quiz = await this.prisma.quiz.create({
        data: {
          name: createQuizDto.name,
          subjectId: createQuizDto.subjectId,
        },
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
          _count: {
            select: {
              califications: true,
            },
          },
        },
      });

      return quiz;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async updateQuiz(id: number, updateQuizDto: UpdateQuizDto) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
      });
      
      if (!quiz) throw new NotFoundException('Evaluación no encontrada');

      // If subjectId is being updated, verify the new subject exists
      if (updateQuizDto.subjectId) {
        const subject = await this.prisma.subject.findUnique({
          where: { id: updateQuizDto.subjectId },
        });

        if (!subject) {
          throw new BadRequestException('Materia no encontrada');
        }
      }

      const updatedQuiz = await this.prisma.quiz.update({
        where: { id },
        data: updateQuizDto,
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
          _count: {
            select: {
              califications: true,
            },
          },
        },
      });

      return updatedQuiz;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async deleteQuiz(id: number): Promise<{ message: string }> {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          califications: true,
        },
      });

      if (!quiz) throw new NotFoundException('Evaluación no encontrada');

      // Check if quiz has califications
      if (quiz.califications.length > 0) {
        throw new BadRequestException(
          'No se puede eliminar la evaluación porque tiene calificaciones asociadas'
        );
      }

      await this.prisma.quiz.delete({
        where: { id },
      });

      return { message: 'Evaluación eliminada exitosamente' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getQuizzesBySubject(subjectId: number) {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) {
        throw new NotFoundException('Materia no encontrada');
      }

      const quizzes = await this.prisma.quiz.findMany({
        where: { subjectId },
        include: {
          _count: {
            select: {
              califications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        subject,
        quizzes,
        totalQuizzes: quizzes.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
