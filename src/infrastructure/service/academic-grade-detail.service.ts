import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicGradeDetail } from 'generated/prisma';
import { AcademicGradeDetailRepository } from '../repository/academic-grade-detail.repository';
import { CreateAcademicGradeDetailDto } from 'src/application/dto/academic-grade-detail/create-academic-grade-detail.dto';
import { UpdateAcademicGradeDetailDto } from 'src/application/dto/academic-grade-detail/update-academic-grade-detail.dto';

@Injectable()
export class AcademicGradeDetailService extends BaseService<AcademicGradeDetail> {
  constructor(private readonly academicGradeDetailRepository: AcademicGradeDetailRepository) {
    super(academicGradeDetailRepository);
  }

  async create(dto: CreateAcademicGradeDetailDto): Promise<AcademicGradeDetail> {
    // Check if detail already exists
    const existing = await this.academicGradeDetailRepository.findUniqueDetail(
      dto.gradeId,
      dto.evaluationItemId
    );
    if (existing) {
      throw new BadRequestException('Grade detail already exists for this item');
    }

    return await this.academicGradeDetailRepository.save(dto);
  }

  async update(id: string, dto: UpdateAcademicGradeDetailDto): Promise<AcademicGradeDetail> {
    await this.findById(id);
    return await this.academicGradeDetailRepository.update(id, dto);
  }

  async findByGrade(gradeId: string): Promise<AcademicGradeDetail[]> {
    return await this.academicGradeDetailRepository.findByGrade(gradeId);
  }

  async findByEvaluationItem(evaluationItemId: string): Promise<AcademicGradeDetail[]> {
    return await this.academicGradeDetailRepository.findByEvaluationItem(evaluationItemId);
  }

  async findCorrectAnswers(gradeId: string): Promise<AcademicGradeDetail[]> {
    return await this.academicGradeDetailRepository.findCorrectAnswers(gradeId);
  }

  async findFlaggedForReview(): Promise<AcademicGradeDetail[]> {
    return await this.academicGradeDetailRepository.findFlaggedForReview();
  }

  async calculateTotalPoints(gradeId: string): Promise<number> {
    return await this.academicGradeDetailRepository.calculateTotalPoints(gradeId);
  }

  async gradeDetail(
    id: string,
    points: number,
    isCorrect: boolean,
    feedback?: string
  ): Promise<AcademicGradeDetail> {
    await this.findById(id);
    
    return await this.academicGradeDetailRepository.update(id, {
      points,
      isCorrect,
      feedback,
      autoGraded: false
    });
  }

  async flagForReview(id: string, reviewNotes?: string): Promise<AcademicGradeDetail> {
    await this.findById(id);
    
    return await this.academicGradeDetailRepository.update(id, {
      flaggedForReview: true,
      reviewNotes
    });
  }

  async unflagForReview(id: string): Promise<AcademicGradeDetail> {
    await this.findById(id);
    
    return await this.academicGradeDetailRepository.update(id, {
      flaggedForReview: false,
      reviewNotes: null
    });
  }

  async createBulkDetails(details: CreateAcademicGradeDetailDto[]): Promise<AcademicGradeDetail[]> {
    const createdDetails: AcademicGradeDetail[] = [];
    
    for (const detail of details) {
      const created = await this.create(detail);
      createdDetails.push(created);
    }
    
    return createdDetails;
  }
}
