/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemStats() {
    try {
      const [
        totalUsers,
        totalSubjects,
        totalQuizzes,
        totalCalifications,
        usersByRole,
        recentActivity,
        gradeStats,
      ] = await Promise.all([
        // Total users
        this.prisma.user.count(),
        
        // Total subjects
        this.prisma.subject.count(),
        
        // Total quizzes
        this.prisma.quiz.count(),
        
        // Total califications
        this.prisma.calification.count(),
        
        // Users by role
        Promise.all([
          this.prisma.user.count({ where: { role: Role.ADMIN } }),
          this.prisma.user.count({ where: { role: Role.PROFESSOR } }),
          this.prisma.user.count({ where: { role: Role.STUDENT } }),
        ]),
        
        // Recent activity (last 7 days)
        Promise.all([
          this.prisma.user.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          }),
          this.prisma.subject.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          }),
          this.prisma.quiz.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          }),
        ]),
        
        // Grade statistics
        this.prisma.calification.aggregate({
          _avg: {
            grade: true,
          },
          _min: {
            grade: true,
          },
          _max: {
            grade: true,
          },
        }),
      ]);

      // Calculate additional metrics
      const totalStudentEnrollments = await this.prisma.studentSubject.count();
      
      const passedGrades = await this.prisma.calification.count({
        where: {
          grade: {
            gte: 70,
          },
        },
      });

      const avgStudentsPerSubject = totalSubjects > 0 
        ? Math.round((totalStudentEnrollments / totalSubjects) * 100) / 100 
        : 0;

      const avgQuizzesPerSubject = totalSubjects > 0 
        ? Math.round((totalQuizzes / totalSubjects) * 100) / 100 
        : 0;

      const passRate = totalCalifications > 0 
        ? Math.round((passedGrades / totalCalifications) * 100) 
        : 0;

      // Get top performing subjects
      const topSubjects = await this.prisma.subject.findMany({
        include: {
          professor: {
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
        orderBy: {
          studentSubject: {
            _count: 'desc',
          },
        },
        take: 5,
      });

      return {
        overview: {
          totalUsers,
          totalSubjects,
          totalQuizzes,
          totalCalifications,
          totalStudentEnrollments,
        },
        userStats: {
          byRole: {
            admin: usersByRole[0],
            professor: usersByRole[1],
            student: usersByRole[2],
          },
        },
        academicStats: {
          avgStudentsPerSubject,
          avgQuizzesPerSubject,
          passRate,
          averageGrade: gradeStats._avg.grade ? Math.round(gradeStats._avg.grade * 100) / 100 : 0,
          minGrade: gradeStats._min.grade || 0,
          maxGrade: gradeStats._max.grade || 0,
        },
        recentActivity: {
          newUsers: recentActivity[0],
          newSubjects: recentActivity[1],
          newQuizzes: recentActivity[2],
        },
        topSubjects: topSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          professor: subject.professor,
          studentsCount: subject._count.studentSubject,
          quizzesCount: subject._count.quizzes,
        })),
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async getMonthlyStats() {
    try {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [currentMonthData, lastMonthData] = await Promise.all([
        // Current month
        Promise.all([
          this.prisma.user.count({
            where: {
              createdAt: {
                gte: currentMonth,
              },
            },
          }),
          this.prisma.subject.count({
            where: {
              createdAt: {
                gte: currentMonth,
              },
            },
          }),
          this.prisma.quiz.count({
            where: {
              createdAt: {
                gte: currentMonth,
              },
            },
          }),
          this.prisma.studentSubject.count({
            where: {
              createdAt: {
                gte: currentMonth,
              },
            },
          }),
        ]),
        
        // Last month
        Promise.all([
          this.prisma.user.count({
            where: {
              createdAt: {
                gte: lastMonth,
                lt: currentMonth,
              },
            },
          }),
          this.prisma.subject.count({
            where: {
              createdAt: {
                gte: lastMonth,
                lt: currentMonth,
              },
            },
          }),
          this.prisma.quiz.count({
            where: {
              createdAt: {
                gte: lastMonth,
                lt: currentMonth,
              },
            },
          }),
          this.prisma.studentSubject.count({
            where: {
              createdAt: {
                gte: lastMonth,
                lt: currentMonth,
              },
            },
          }),
        ]),
      ]);

      return {
        currentMonth: {
          users: currentMonthData[0],
          subjects: currentMonthData[1],
          quizzes: currentMonthData[2],
          enrollments: currentMonthData[3],
        },
        lastMonth: {
          users: lastMonthData[0],
          subjects: lastMonthData[1],
          quizzes: lastMonthData[2],
          enrollments: lastMonthData[3],
        },
        growth: {
          users: lastMonthData[0] > 0 ? Math.round(((currentMonthData[0] - lastMonthData[0]) / lastMonthData[0]) * 100) : 0,
          subjects: lastMonthData[1] > 0 ? Math.round(((currentMonthData[1] - lastMonthData[1]) / lastMonthData[1]) * 100) : 0,
          quizzes: lastMonthData[2] > 0 ? Math.round(((currentMonthData[2] - lastMonthData[2]) / lastMonthData[2]) * 100) : 0,
          enrollments: lastMonthData[3] > 0 ? Math.round(((currentMonthData[3] - lastMonthData[3]) / lastMonthData[3]) * 100) : 0,
        },
      };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
