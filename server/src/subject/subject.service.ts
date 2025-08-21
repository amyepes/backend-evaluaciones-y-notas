import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectEntity } from './subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectQueryDto } from './dto/subject-query.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSubjects(query: SubjectQueryDto) {
    try {
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
      }

      if (query.professorId) {
        where.professorId = parseInt(query.professorId);
      }

      const [subjects, total] = await Promise.all([
        this.prisma.subject.findMany({
          where,
          skip,
          take: limit,
          include: {
            professor: {
              select: {
                id: true,
                name: true,
                username: true,
                role: true,
              },
            },
            _count: {
              select: {
                studentSubject: true,
                quizzes: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.subject.count({ where }),
      ]);

      return {
        subjects,
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

  async getSubjectById(id: number): Promise<SubjectEntity | undefined> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
            },
          },
          studentSubject: {
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
          quizzes: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              studentSubject: true,
              quizzes: true,
            },
          },
        },
      });

      if (!subject) throw new NotFoundException('Materia no encontrada');
      
      return subject;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async createSubject(body: CreateSubjectDto): Promise<SubjectEntity | undefined> {
    try {
      // Verify professor exists and has PROFESSOR role
      const professor = await this.prisma.user.findUnique({
        where: { id: body.professorId },
        select: { id: true, role: true, name: true },
      });

      if (!professor) {
        throw new BadRequestException('Profesor no encontrado');
      }

      if (professor.role !== Role.PROFESSOR) {
        throw new BadRequestException('El usuario seleccionado no es un profesor');
      }

      // Check if subject name already exists for this professor
      const existingSubject = await this.prisma.subject.findFirst({
        where: {
          name: body.name,
          professorId: body.professorId,
        },
      });

      if (existingSubject) {
        throw new BadRequestException('Ya existe una materia con este nombre para este profesor');
      }

      const newSubject = await this.prisma.subject.create({
        data: {
          name: body.name,
          professorId: body.professorId,
        },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
            },
          },
          _count: {
            select: {
              studentSubject: true,
              quizzes: true,
            },
          },
        },
      });

      return newSubject;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async updateSubject(id: number, body: UpdateSubjectDto): Promise<SubjectEntity | undefined> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id },
      });
      
      if (!subject) throw new NotFoundException('Materia no encontrada');

      // If professorId is being updated, verify the new professor
      if (body.professorId) {
        const professor = await this.prisma.user.findUnique({
          where: { id: body.professorId },
          select: { id: true, role: true },
        });

        if (!professor) {
          throw new BadRequestException('Profesor no encontrado');
        }

        if (professor.role !== Role.PROFESSOR) {
          throw new BadRequestException('El usuario seleccionado no es un profesor');
        }
      }

      // Check for duplicate subject name if name or professor is being updated
      if (body.name || body.professorId) {
        const professorId = body.professorId || subject.professorId;
        const name = body.name || subject.name;

        const existingSubject = await this.prisma.subject.findFirst({
          where: {
            name,
            professorId,
            NOT: { id },
          },
        });

        if (existingSubject) {
          throw new BadRequestException('Ya existe una materia con este nombre para este profesor');
        }
      }

      const updatedSubject = await this.prisma.subject.update({
        where: { id },
        data: body,
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
            },
          },
          _count: {
            select: {
              studentSubject: true,
              quizzes: true,
            },
          },
        },
      });

      return updatedSubject;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async deleteSubject(id: number): Promise<{ message: string } | undefined> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id },
        include: {
          studentSubject: true,
          quizzes: true,
        },
      });

      if (!subject) throw new NotFoundException('Materia no encontrada');

      // Check if subject has related data
      if (subject.studentSubject.length > 0 || subject.quizzes.length > 0) {
        throw new BadRequestException(
          'No se puede eliminar la materia porque tiene estudiantes o evaluaciones asociadas'
        );
      }

      await this.prisma.subject.delete({
        where: { id },
      });

      return { message: 'Materia eliminada exitosamente' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async assignStudentToSubject(subjectId: number, studentId: number) {
    try {
      // Verify subject exists
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) {
        throw new NotFoundException('Materia no encontrada');
      }

      // Verify student exists and has STUDENT role
      const student = await this.prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, role: true },
      });

      if (!student) {
        throw new BadRequestException('Estudiante no encontrado');
      }

      if (student.role !== Role.STUDENT) {
        throw new BadRequestException('El usuario seleccionado no es un estudiante');
      }

      // Check if student is already assigned to this subject
      const existingAssignment = await this.prisma.studentSubject.findFirst({
        where: {
          studentId,
          subjectId,
        },
      });

      if (existingAssignment) {
        throw new BadRequestException('El estudiante ya está asignado a esta materia');
      }

      const assignment = await this.prisma.studentSubject.create({
        data: {
          studentId,
          subjectId,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return assignment;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async removeStudentFromSubject(subjectId: number, studentId: number) {
    try {
      const assignment = await this.prisma.studentSubject.findFirst({
        where: {
          studentId,
          subjectId,
        },
      });

      if (!assignment) {
        throw new NotFoundException('El estudiante no está asignado a esta materia');
      }

      await this.prisma.studentSubject.delete({
        where: { id: assignment.id },
      });

      return { message: 'Estudiante removido de la materia exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

}
