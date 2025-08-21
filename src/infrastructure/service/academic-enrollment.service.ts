import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicEnrollment, EnrollmentStatus } from 'generated/prisma';
import { AcademicEnrollmentRepository } from '../repository/academic-enrollment.repository';
import { CreateAcademicEnrollmentDto } from 'src/application/dto/academic-enrollment/create-academic-enrollment.dto';
import { UpdateAcademicEnrollmentDto } from 'src/application/dto/academic-enrollment/update-academic-enrollment.dto';

@Injectable()
export class AcademicEnrollmentService extends BaseService<AcademicEnrollment> {
  constructor(private readonly academicEnrollmentRepository: AcademicEnrollmentRepository) {
    super(academicEnrollmentRepository);
  }

  async create(dto: CreateAcademicEnrollmentDto): Promise<AcademicEnrollment> {
    // Check if enrollment already exists
    const existing = await this.academicEnrollmentRepository.findUniqueEnrollment(
      dto.studentId,
      dto.subjectId,
      dto.periodId
    );
    if (existing) {
      throw new BadRequestException('Student is already enrolled in this subject for this period');
    }

    return await this.academicEnrollmentRepository.save({
      ...dto,
      enrollmentDate: dto.enrollmentDate || new Date()
    });
  }

  async update(id: string, dto: UpdateAcademicEnrollmentDto): Promise<AcademicEnrollment> {
    await this.findById(id);
    return await this.academicEnrollmentRepository.update(id, dto);
  }

  async findByStudent(studentId: string): Promise<AcademicEnrollment[]> {
    return await this.academicEnrollmentRepository.findByStudent(studentId);
  }

  async findBySubject(subjectId: string): Promise<AcademicEnrollment[]> {
    return await this.academicEnrollmentRepository.findBySubject(subjectId);
  }

  async findByPeriod(periodId: string): Promise<AcademicEnrollment[]> {
    return await this.academicEnrollmentRepository.findByPeriod(periodId);
  }

  async findByStudentAndPeriod(studentId: string, periodId: string): Promise<AcademicEnrollment[]> {
    return await this.academicEnrollmentRepository.findByStudentAndPeriod(studentId, periodId);
  }

  async findByStatus(status: EnrollmentStatus): Promise<AcademicEnrollment[]> {
    return await this.academicEnrollmentRepository.findByStatus(status);
  }

  async updateEnrollmentStatus(
    id: string, 
    status: EnrollmentStatus, 
    additionalData?: any
  ): Promise<AcademicEnrollment> {
    await this.findById(id);

    // Add timestamp for certain status changes
    const updateData: Record<string, unknown> = { ...(additionalData ?? {}) };
    if (status === EnrollmentStatus.DROPPED) {
      if (updateData.droppedDate === undefined || updateData.droppedDate === null) {
        updateData.droppedDate = new Date();
      }
    } else if (status === EnrollmentStatus.COMPLETED) {
      if (updateData.completedDate === undefined || updateData.completedDate === null) {
        updateData.completedDate = new Date();
      }
    }
    

    return await this.academicEnrollmentRepository.updateEnrollmentStatus(id, status, updateData);
  }

  async dropEnrollment(id: string, reason?: string): Promise<AcademicEnrollment> {
    return await this.updateEnrollmentStatus(id, EnrollmentStatus.DROPPED, {
      dropReason: reason,
      droppedDate: new Date()
    });
  }

  async completeEnrollment(id: string, finalGrade: number, finalPercentage: number): Promise<AcademicEnrollment> {
    return await this.updateEnrollmentStatus(id, EnrollmentStatus.COMPLETED, {
      finalGrade,
      finalPercentage,
      completedDate: new Date()
    });
  }
}
