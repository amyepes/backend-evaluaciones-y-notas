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
      const page = Math.max(1, parseInt(query.page || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
      const skip = (page - 1) * limit;

      const where: Record<string, any> = {};
      
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
              createdAt: true,
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
      throw new InternalServerErrorException('Error interno del servidor');
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
      throw new InternalServerErrorException('Error interno del servidor');
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
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async deleteSubject(id: number): Promise<{ message: string }> {
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
      throw new InternalServerErrorException('Error interno del servidor');
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
      throw new InternalServerErrorException('Error interno del servidor');
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
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getSubjectStats() {
    try {
      const [totalSubjects, totalStudentAssignments, totalQuizzes, subjectsByProfessor] = await Promise.all([
        this.prisma.subject.count(),
        this.prisma.studentSubject.count(),
        this.prisma.quiz.count(),
        this.prisma.subject.groupBy({
          by: ['professorId'],
          _count: {
            id: true,
          },
          orderBy: {
            _count: {
              id: 'desc',
            },
          },
        }),
      ]);

      const avgStudentsPerSubject = totalSubjects > 0 
        ? Math.round((totalStudentAssignments / totalSubjects) * 100) / 100 
        : 0;

      const avgQuizzesPerSubject = totalSubjects > 0 
        ? Math.round((totalQuizzes / totalSubjects) * 100) / 100 
        : 0;

      return {
        total: totalSubjects,
        totalStudentAssignments,
        totalQuizzes,
        avgStudentsPerSubject,
        avgQuizzesPerSubject,
        subjectsByProfessor: subjectsByProfessor.length,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getSubjectsByProfessor(professorId: number) {
    try {
      const professor = await this.prisma.user.findUnique({
        where: { id: professorId },
        select: { id: true, role: true, name: true },
      });

      if (!professor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      if (professor.role !== Role.PROFESSOR) {
        throw new BadRequestException('El usuario seleccionado no es un profesor');
      }

      const subjects = await this.prisma.subject.findMany({
        where: { professorId },
        include: {
          _count: {
            select: {
              studentSubject: true,
              quizzes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        professor: {
          id: professor.id,
          name: professor.name,
        },
        subjects,
        totalSubjects: subjects.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getSubjectStudents(subjectId: number) {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
        select: { id: true, name: true },
      });

      if (!subject) {
        throw new NotFoundException('Materia no encontrada');
      }

      const students = await this.prisma.studentSubject.findMany({
        where: { subjectId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              username: true,
              createdAt: true,
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
        subject,
        students: students.map(ss => ({
          ...ss.student,
          assignedAt: ss.createdAt,
        })),
        totalStudents: students.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async searchSubjects(searchTerm: string, limit: number = 10) {
    try {
      const subjects = await this.prisma.subject.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { 
              professor: { 
                name: { contains: searchTerm, mode: 'insensitive' } 
              } 
            },
          ],
        },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          _count: {
            select: {
              studentSubject: true,
              quizzes: true,
            },
          },
        },
        take: limit,
        orderBy: { name: 'asc' },
      });

      return subjects;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
