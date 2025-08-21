import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicGrade, GradeStatus } from 'generated/prisma';
import { AcademicGradeRepository } from '../repository/academic-grade.repository';
import { CreateAcademicGradeDto } from 'src/application/dto/academic-grade/create-academic-grade.dto';
import { UpdateAcademicGradeDto } from 'src/application/dto/academic-grade/update-academic-grade.dto';

@Injectable()
export class AcademicGradeService extends BaseService<AcademicGrade> {
  constructor(private readonly academicGradeRepository: AcademicGradeRepository) {
    super(academicGradeRepository);
  }

  async create(dto: CreateAcademicGradeDto): Promise<AcademicGrade> {
    const attemptNumber = dto.attemptNumber || 1;
    
    // Check if grade already exists for this attempt
    const existing = await this.academicGradeRepository.findUniqueGrade(
      dto.evaluationId,
      dto.studentId,
      attemptNumber
    );
    if (existing) {
      throw new BadRequestException(`Grade already exists for attempt ${attemptNumber}`);
    }

    return await this.academicGradeRepository.save({
      ...dto,
      attemptNumber
    });
  }

  async update(id: string, dto: UpdateAcademicGradeDto): Promise<AcademicGrade> {
    await this.findById(id);
    return await this.academicGradeRepository.update(id, dto);
  }

  async findByStudent(studentId: string): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findByStudent(studentId);
  }

  async findByEvaluation(evaluationId: string): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findByEvaluation(evaluationId);
  }

  async findByStudentAndEvaluation(studentId: string, evaluationId: string): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findByStudentAndEvaluation(studentId, evaluationId);
  }

  async findByStatus(status: GradeStatus): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findByStatus(status);
  }

  async findByGrader(graderId: string): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findByGrader(graderId);
  }

  async findPendingGrades(): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findPendingGrades();
  }

  async findAllWithRelations(): Promise<AcademicGrade[]> {
    return await this.academicGradeRepository.findAllWithRelations();
  }

  async submitGrade(id: string): Promise<AcademicGrade> {
    await this.findById(id);
    return await this.academicGradeRepository.update(id, {
      submittedAt: new Date(),
      status: GradeStatus.PENDING
    });
  }

  async gradeSubmission(
    id: string, 
    score: number, 
    graderId: string,
    feedback?: string
  ): Promise<AcademicGrade> {
    const grade = await this.findById(id);
    
    const percentage = (score / grade.maxPossibleScore.toNumber()) * 100;
    
    return await this.academicGradeRepository.update(id, {
      score,
      percentage,
      gradedAt: new Date(),
      gradedBy: graderId,
      feedback,
      status: GradeStatus.GRADED
    });
  }

  async finalizeGrade(id: string): Promise<AcademicGrade> {
    await this.findById(id);
    return await this.academicGradeRepository.update(id, {
      status: GradeStatus.FINAL
    });
  }

  async requestReview(id: string): Promise<AcademicGrade> {
    await this.findById(id);
    return await this.academicGradeRepository.update(id, {
      status: GradeStatus.REVIEW_REQUESTED
    });
  }

  async startReview(id: string): Promise<AcademicGrade> {
    await this.findById(id);
    return await this.academicGradeRepository.update(id, {
      status: GradeStatus.UNDER_REVIEW
    });
  }
}
