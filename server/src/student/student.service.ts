/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentSubjects(studentId: number) {
    try {
      const studentSubjects = await this.prisma.studentSubject.findMany({
        where: { studentId },
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
              _count: {
                select: {
                  quizzes: true,
                  studentSubject: true,
                },
              },
            },
          },
        },
        orderBy: {
          subject: {
            name: 'asc',
          },
        },
      });

      // Filter duplicates by subject ID (additional safety measure)
      const uniqueSubjects = studentSubjects.reduce((acc, ss) => {
        const existingIndex = acc.findIndex(item => item.subject.id === ss.subject.id);
        if (existingIndex === -1) {
          acc.push(ss);
        } else {
          // Keep the most recent enrollment if duplicates exist
          if (ss.createdAt > acc[existingIndex].createdAt) {
            acc[existingIndex] = ss;
          }
        }
        return acc;
      }, [] as typeof studentSubjects);

      return {
        subjects: uniqueSubjects.map(ss => ({
          enrollmentId: ss.id,
          enrolledAt: ss.createdAt,
          subject: ss.subject,
        })),
        totalSubjects: uniqueSubjects.length,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getSubjectQuizzesWithGrades(subjectId: number, studentId: number) {
    try {
      // Verify student is enrolled in this subject
      const enrollment = await this.prisma.studentSubject.findFirst({
        where: {
          studentId,
          subjectId,
        },
      });

      if (!enrollment) {
        throw new ForbiddenException('No estás inscrito en esta materia');
      }

      // Get subject info
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      if (!subject) {
        throw new NotFoundException('Materia no encontrada');
      }

      // Get all quizzes for this subject with student's grades
      const quizzes = await this.prisma.quiz.findMany({
        where: { subjectId },
        include: {
          califications: {
            where: { studentId },
            select: {
              id: true,
              grade: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const quizzesWithGrades = quizzes.map(quiz => ({
        id: quiz.id,
        name: quiz.name,
        createdAt: quiz.createdAt,
        grade: quiz.califications.length > 0 ? quiz.califications[0].grade : null,
        hasGrade: quiz.califications.length > 0,
      }));

      // Calculate stats
      const gradedQuizzes = quizzesWithGrades.filter(q => q.hasGrade);
      const averageGrade = gradedQuizzes.length > 0 
        ? Math.round((gradedQuizzes.reduce((sum, q) => sum + (q.grade || 0), 0) / gradedQuizzes.length) * 100) / 100
        : null;

      return {
        subject,
        quizzes: quizzesWithGrades,
        stats: {
          totalQuizzes: quizzes.length,
          gradedQuizzes: gradedQuizzes.length,
          pendingQuizzes: quizzes.length - gradedQuizzes.length,
          averageGrade,
        },
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getStudentGrades(studentId: number) {
    try {
      const grades = await this.prisma.calification.findMany({
        where: { studentId },
        include: {
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
        orderBy: {
          quiz: {
            createdAt: 'desc',
          },
        },
      });

      // Group grades by subject
      const gradesBySubject = grades.reduce((acc: any, grade) => {
        const subjectId = grade.quiz.subject.id;
        if (!acc[subjectId]) {
          acc[subjectId] = {
            subject: grade.quiz.subject,
            grades: [],
            totalGrades: 0,
            averageGrade: 0,
          };
        }
        acc[subjectId].grades.push({
          id: grade.id,
          grade: grade.grade,
          quiz: {
            id: grade.quiz.id,
            name: grade.quiz.name,
          },
        });
        return acc;
      }, {});

      // Calculate averages
      Object.values(gradesBySubject).forEach((subjectData: any) => {
        const total = subjectData.grades.reduce((sum: number, g: any) => sum + g.grade, 0);
        subjectData.totalGrades = subjectData.grades.length;
        subjectData.averageGrade = subjectData.totalGrades > 0 
          ? Math.round((total / subjectData.totalGrades) * 100) / 100
          : 0;
      });

      const overallAverage = grades.length > 0 
        ? Math.round((grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) * 100) / 100
        : 0;

      return {
        gradesBySubject: Object.values(gradesBySubject),
        totalGrades: grades.length,
        overallAverage,
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getStudentSubjectStats(subjectId: number, studentId: number) {
    try {
      // Verify student is enrolled in this subject
      const enrollment = await this.prisma.studentSubject.findFirst({
        where: {
          studentId,
          subjectId,
        },
      });

      if (!enrollment) {
        throw new ForbiddenException('No estás inscrito en esta materia');
      }

      const [subject, grades, classmates] = await Promise.all([
        this.prisma.subject.findUnique({
          where: { id: subjectId },
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
        }),
        this.prisma.calification.findMany({
          where: {
            studentId,
            quiz: {
              subjectId,
            },
          },
          include: {
            quiz: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.studentSubject.count({
          where: { subjectId },
        }),
      ]);

      const averageGrade = grades.length > 0 
        ? Math.round((grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) * 100) / 100
        : null;

      return {
        subject,
        stats: {
          totalGrades: grades.length,
          averageGrade,
          totalClassmates: classmates - 1, // Exclude self
          enrolledAt: enrollment.createdAt,
        },
        recentGrades: grades
          .sort((a, b) => new Date(b.quiz.id).getTime() - new Date(a.quiz.id).getTime())
          .slice(0, 5)
          .map(g => ({
            grade: g.grade,
            quiz: g.quiz,
          })),
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException)
        throw error;
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
