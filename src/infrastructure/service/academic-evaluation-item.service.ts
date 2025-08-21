import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicEvaluationItem, ItemType } from 'generated/prisma';
import { AcademicEvaluationItemRepository } from '../repository/academic-evaluation-item.repository';
import { CreateAcademicEvaluationItemDto } from 'src/application/dto/academic-evaluation-item/create-academic-evaluation-item.dto';
import { UpdateAcademicEvaluationItemDto } from 'src/application/dto/academic-evaluation-item/update-academic-evaluation-item.dto';

@Injectable()
export class AcademicEvaluationItemService extends BaseService<AcademicEvaluationItem> {
  constructor(private readonly academicEvaluationItemRepository: AcademicEvaluationItemRepository) {
    super(academicEvaluationItemRepository);
  }

  async create(dto: CreateAcademicEvaluationItemDto): Promise<AcademicEvaluationItem> {
    // Check if item number exists for this evaluation
    const existing = await this.academicEvaluationItemRepository.findByEvaluationAndNumber(
      dto.evaluationId,
      dto.itemNumber
    );
    if (existing) {
      throw new BadRequestException('Item number already exists for this evaluation');
    }

    return await this.academicEvaluationItemRepository.save(dto);
  }

  async update(id: string, dto: UpdateAcademicEvaluationItemDto): Promise<AcademicEvaluationItem> {
    const existingItem = await this.findById(id);

    // Check item number uniqueness if updating
    if (dto.itemNumber && dto.itemNumber !== existingItem.itemNumber) {
      const itemWithNumber = await this.academicEvaluationItemRepository.findByEvaluationAndNumber(
        existingItem.evaluationId,
        dto.itemNumber
      );
      if (itemWithNumber) {
        throw new BadRequestException('Item number already exists for this evaluation');
      }
    }

    return await this.academicEvaluationItemRepository.update(id, dto);
  }

  async findByEvaluation(evaluationId: string): Promise<AcademicEvaluationItem[]> {
    return await this.academicEvaluationItemRepository.findByEvaluation(evaluationId);
  }

  async findByType(type: ItemType): Promise<AcademicEvaluationItem[]> {
    return await this.academicEvaluationItemRepository.findByType(type);
  }

  async findByDifficultyLevel(evaluationId: string, difficultyLevel: string): Promise<AcademicEvaluationItem[]> {
    return await this.academicEvaluationItemRepository.findByDifficultyLevel(evaluationId, difficultyLevel);
  }

  async findRequiredItems(evaluationId: string): Promise<AcademicEvaluationItem[]> {
    return await this.academicEvaluationItemRepository.findRequiredItems(evaluationId);
  }

  async getTotalPoints(evaluationId: string): Promise<number> {
    return await this.academicEvaluationItemRepository.getTotalPoints(evaluationId);
  }


  async reorderItems(evaluationId: string, itemOrders: { itemId: string; displayOrder: number }[]): Promise<void> {
    for (const order of itemOrders) {
      await this.academicEvaluationItemRepository.update(order.itemId, {
        displayOrder: order.displayOrder
      });
    }
  }
}
