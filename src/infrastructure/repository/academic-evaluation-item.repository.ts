import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { AcademicEvaluationItem, ActiveStatus, ItemType } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class AcademicEvaluationItemRepository extends BaseRepositoryImpl<AcademicEvaluationItem> {
  constructor(prisma: PrismaService) {
    super(prisma, 'academicEvaluationItem');
  }

  async findByEvaluation(evaluationId: string): Promise<AcademicEvaluationItem[]> {
    return await this.prisma.academicEvaluationItem.findMany({
      where: {
        evaluationId,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async findByType(type: ItemType): Promise<AcademicEvaluationItem[]> {
    return await this.prisma.academicEvaluationItem.findMany({
      where: {
        type,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByEvaluationAndNumber(evaluationId: string, itemNumber: number): Promise<AcademicEvaluationItem | null> {
    return await this.prisma.academicEvaluationItem.findFirst({
      where: {
        evaluationId,
        itemNumber,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByDifficultyLevel(evaluationId: string, difficultyLevel: string): Promise<AcademicEvaluationItem[]> {
    return await this.prisma.academicEvaluationItem.findMany({
      where: {
        evaluationId,
        difficultyLevel,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async findRequiredItems(evaluationId: string): Promise<AcademicEvaluationItem[]> {
    return await this.prisma.academicEvaluationItem.findMany({
      where: {
        evaluationId,
        isRequired: true,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
  }

  async getTotalPoints(evaluationId: string): Promise<number> {
    const result = await this.prisma.academicEvaluationItem.aggregate({
      where: {
        evaluationId,
        isActive: ActiveStatus.ACTIVE
      },
      _sum: {
        points: true
      }
    });
    return result._sum.points?.toNumber() || 0;
  }
}
