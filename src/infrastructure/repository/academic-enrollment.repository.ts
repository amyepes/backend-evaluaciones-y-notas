import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicEnrollment, ActiveStatus, EnrollmentStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicEnrollmentRepository extends BaseRepositoryImpl<AcademicEnrollment> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicEnrollment');
  }

  async findByStudent(studentId: string): Promise<AcademicEnrollment[]> {
    return await this.prisma.academicEnrollment.findMany({
      where: {
        studentId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subject: true,
        period: true
      }
    });
  }

  async findBySubject(subjectId: string): Promise<AcademicEnrollment[]> {
    return await this.prisma.academicEnrollment.findMany({
      where: {
        subjectId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        period: true
      }
    });
  }

  async findByPeriod(periodId: string): Promise<AcademicEnrollment[]> {
    return await this.prisma.academicEnrollment.findMany({
      where: {
        periodId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        subject: true
      }
    });
  }

  async findByStudentAndPeriod(studentId: string, periodId: string): Promise<AcademicEnrollment[]> {
    return await this.prisma.academicEnrollment.findMany({
      where: {
        studentId,
        periodId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        subject: true
      }
    });
  }

  async findByStatus(status: EnrollmentStatus): Promise<AcademicEnrollment[]> {
    return await this.prisma.academicEnrollment.findMany({
      where: {
        status,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        student: true,
        subject: true,
        period: true
      }
    });
  }

  async findUniqueEnrollment(studentId: string, subjectId: string, periodId: string): Promise<AcademicEnrollment | null> {
    return await this.prisma.academicEnrollment.findFirst({
      where: {
        studentId,
        subjectId,
        periodId,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus, additionalData?: any): Promise<AcademicEnrollment> {
    return await this.prisma.academicEnrollment.update({
      where: { id },
      data: {
        status,
        ...additionalData
      }
    });
  }
}
