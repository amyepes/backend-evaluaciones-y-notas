import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicEvaluation, ActiveStatus, EvaluationStatus, EvaluationType } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicEvaluationRepository extends BaseRepositoryImpl<AcademicEvaluation> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicEvaluation');
  }

  async findByPeriodAndSubject(periodId: string, subjectId: string): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        periodId,
        subjectId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        teacher: true
      }
    });
  }

  async findByTeacher(teacherId: string): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        teacherId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subject: true,
        period: true
      }
    });
  }

  async findByStatus(status: EvaluationStatus): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        status,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subject: true,
        period: true,
        teacher: true
      }
    });
  }

  async findByType(type: EvaluationType): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        type,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subject: true,
        period: true,
        teacher: true
      }
    });
  }

  async findByCode(periodId: string, subjectId: string, code: string): Promise<AcademicEvaluation | null> {
    return await this.prisma.academicEvaluation.findFirst({
      where: {
        periodId,
        subjectId,
        code,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findUpcoming(date: Date): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        scheduledDate: { gte: date },
        status: { in: [EvaluationStatus.SCHEDULED, EvaluationStatus.ACTIVE] },
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        scheduledDate: 'asc'
      },
      include: {
        subject: true,
        period: true
      }
    });
  }

  async findAllWithRelations(): Promise<AcademicEvaluation[]> {
    return await this.prisma.academicEvaluation.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        period: true,
        subject: true,
        teacher: true,
        items: true,
        grades: true
      }
    });
  }
}
