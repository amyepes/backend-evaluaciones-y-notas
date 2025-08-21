import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicEvaluation, EvaluationStatus, EvaluationType } from 'generated/prisma';
import { AcademicEvaluationRepository } from '../repository/academic-evaluation.repository';
import { CreateAcademicEvaluationDto } from 'src/application/dto/academic-evaluation/create-academic-evaluation.dto';
import { UpdateAcademicEvaluationDto } from 'src/application/dto/academic-evaluation/update-academic-evaluation.dto';

@Injectable()
export class AcademicEvaluationService extends BaseService<AcademicEvaluation> {
  constructor(private readonly academicEvaluationRepository: AcademicEvaluationRepository) {
    super(academicEvaluationRepository);
  }

  async create(dto: CreateAcademicEvaluationDto): Promise<AcademicEvaluation> {
    // Check if code exists for this period and subject
    const existing = await this.academicEvaluationRepository.findByCode(
      dto.periodId,
      dto.subjectId,
      dto.code
    );
    if (existing) {
      throw new BadRequestException('Evaluation code already exists for this period and subject');
    }

    return await this.academicEvaluationRepository.save(dto);
  }

  async update(id: string, dto: UpdateAcademicEvaluationDto): Promise<AcademicEvaluation> {
    const existingEvaluation = await this.findById(id);

    // Check code uniqueness if updating
    if (dto.code && dto.code !== existingEvaluation.code) {
      const evaluationWithCode = await this.academicEvaluationRepository.findByCode(
        existingEvaluation.periodId,
        existingEvaluation.subjectId,
        dto.code
      );
      if (evaluationWithCode) {
        throw new BadRequestException('Evaluation code already exists for this period and subject');
      }
    }

    return await this.academicEvaluationRepository.update(id, dto);
  }

  async findByPeriodAndSubject(periodId: string, subjectId: string): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findByPeriodAndSubject(periodId, subjectId);
  }

  async findByTeacher(teacherId: string): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findByTeacher(teacherId);
  }

  async findByStatus(status: EvaluationStatus): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findByStatus(status);
  }

  async findByType(type: EvaluationType): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findByType(type);
  }

  async findUpcoming(date?: Date): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findUpcoming(date || new Date());
  }

  async findAllWithRelations(): Promise<AcademicEvaluation[]> {
    return await this.academicEvaluationRepository.findAllWithRelations();
  }

  async activateEvaluation(id: string): Promise<AcademicEvaluation> {
    await this.findById(id);
    return await this.academicEvaluationRepository.update(id, {
      status: EvaluationStatus.ACTIVE
    });
  }

  async completeEvaluation(id: string): Promise<AcademicEvaluation> {
    await this.findById(id);
    return await this.academicEvaluationRepository.update(id, {
      status: EvaluationStatus.COMPLETED
    });
  }

  async cancelEvaluation(id: string): Promise<AcademicEvaluation> {
    await this.findById(id);
    return await this.academicEvaluationRepository.update(id, {
      status: EvaluationStatus.CANCELLED
    });
  }
}
