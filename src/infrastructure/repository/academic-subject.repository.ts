import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicSubject, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicSubjectRepository extends BaseRepositoryImpl<AcademicSubject> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicSubject');
  }

  async findByCode(code: string): Promise<AcademicSubject | null> {
    return await this.prisma.academicSubject.findFirst({
      where: {
        code,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findBySemester(semester: number): Promise<AcademicSubject[]> {
    return await this.prisma.academicSubject.findMany({
      where: {
        semester,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByKnowledgeArea(knowledgeArea: string): Promise<AcademicSubject[]> {
    return await this.prisma.academicSubject.findMany({
      where: {
        knowledgeArea,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findAllWithRelations(): Promise<AcademicSubject[]> {
    return await this.prisma.academicSubject.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        periods: true,
        evaluations: true,
        enrollments: true
      }
    });
  }

  async findByIdWithRelations(id: string): Promise<AcademicSubject | null> {
    return await this.prisma.academicSubject.findFirst({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        periods: true,
        evaluations: true,
        enrollments: {
          include: {
            student: true
          }
        }
      }
    });
  }
}
