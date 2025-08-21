import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicGradeDetail, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicGradeDetailRepository extends BaseRepositoryImpl<AcademicGradeDetail> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicGradeDetail');
  }

  async findByGrade(gradeId: string): Promise<AcademicGradeDetail[]> {
    return await this.prisma.academicGradeDetail.findMany({
      where: {
        gradeId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        evaluationItem: true
      }
    });
  }

  async findByEvaluationItem(evaluationItemId: string): Promise<AcademicGradeDetail[]> {
    return await this.prisma.academicGradeDetail.findMany({
      where: {
        evaluationItemId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        grade: {
          include: {
            student: true
          }
        }
      }
    });
  }

  async findUniqueDetail(gradeId: string, evaluationItemId: string): Promise<AcademicGradeDetail | null> {
    return await this.prisma.academicGradeDetail.findFirst({
      where: {
        gradeId,
        evaluationItemId,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findCorrectAnswers(gradeId: string): Promise<AcademicGradeDetail[]> {
    return await this.prisma.academicGradeDetail.findMany({
      where: {
        gradeId,
        isCorrect: true,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findFlaggedForReview(): Promise<AcademicGradeDetail[]> {
    return await this.prisma.academicGradeDetail.findMany({
      where: {
        flaggedForReview: true,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        grade: {
          include: {
            student: true,
            evaluation: {
              include: {
                subject: true
              }
            }
          }
        },
        evaluationItem: true
      }
    });
  }

  async calculateTotalPoints(gradeId: string): Promise<number> {
    const result = await this.prisma.academicGradeDetail.aggregate({
      where: {
        gradeId,
        isActive: ActiveStatus.ACTIVE
      },
      _sum: {
        points: true
      }
    });
    return result._sum.points?.toNumber() || 0;
  }
}
