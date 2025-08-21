import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicGrade, ActiveStatus, GradeStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicGradeRepository extends BaseRepositoryImpl<AcademicGrade> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicGrade');
  }

  async findByStudent(studentId: string): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        studentId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        evaluation: {
          include: {
            subject: true,
            period: true
          }
        }
      }
    });
  }

  async findByEvaluation(evaluationId: string): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        evaluationId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true
      }
    });
  }

  async findByStudentAndEvaluation(studentId: string, evaluationId: string): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        studentId,
        evaluationId,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        attemptNumber: 'desc'
      }
    });
  }

  async findUniqueGrade(evaluationId: string, studentId: string, attemptNumber: number): Promise<AcademicGrade | null> {
    return await this.prisma.academicGrade.findFirst({
      where: {
        evaluationId,
        studentId,
        attemptNumber,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByStatus(status: GradeStatus): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        status,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        evaluation: {
          include: {
            subject: true
          }
        }
      }
    });
  }

  async findByGrader(graderId: string): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        gradedBy: graderId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        evaluation: {
          include: {
            subject: true
          }
        }
      }
    });
  }

  async findPendingGrades(): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        status: GradeStatus.PENDING,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        evaluation: {
          include: {
            subject: true,
            teacher: true
          }
        }
      }
    });
  }

  async findAllWithRelations(): Promise<AcademicGrade[]> {
    return await this.prisma.academicGrade.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        evaluation: true,
        student: true,
        grader: true,
        gradeDetails: true
      }
    });
  }
}
