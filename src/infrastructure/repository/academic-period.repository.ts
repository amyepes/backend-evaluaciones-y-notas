import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicPeriod, ActiveStatus, PeriodStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicPeriodRepository extends BaseRepositoryImpl<AcademicPeriod> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicPeriod');
  }

  async findByCode(code: string): Promise<AcademicPeriod | null> {
    return await this.prisma.academicPeriod.findFirst({
      where: {
        code,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByStatus(status: PeriodStatus): Promise<AcademicPeriod[]> {
    return await this.prisma.academicPeriod.findMany({
      where: {
        status,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findActivePeriods(): Promise<AcademicPeriod[]> {
    return await this.prisma.academicPeriod.findMany({
      where: {
        status: PeriodStatus.ACTIVE,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findDefaultPeriod(): Promise<AcademicPeriod | null> {
    return await this.prisma.academicPeriod.findFirst({
      where: {
        isDefault: true,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AcademicPeriod[]> {
    return await this.prisma.academicPeriod.findMany({
      where: {
        startDate: { gte: startDate },
        endDate: { lte: endDate },
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findAllWithRelations(): Promise<AcademicPeriod[]> {
    return await this.prisma.academicPeriod.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subjects: true,
        evaluations: true,
        enrollments: true
      }
    });
  }
}
