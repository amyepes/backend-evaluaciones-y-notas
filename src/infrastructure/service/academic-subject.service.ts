import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicSubject } from 'generated/prisma';
import { AcademicSubjectRepository } from '../repository/academic-subject.repository';
import { CreateAcademicSubjectDto } from 'src/application/dto/academic-subject/create-academic-subject.dto';
import { UpdateAcademicSubjectDto } from 'src/application/dto/academic-subject/update-academic-subject.dto';

@Injectable()
export class AcademicSubjectService extends BaseService<AcademicSubject> {
  constructor(private readonly academicSubjectRepository: AcademicSubjectRepository) {
    super(academicSubjectRepository);
  }

  async create(dto: CreateAcademicSubjectDto): Promise<AcademicSubject> {
    // Check if code exists
    const existingCode = await this.academicSubjectRepository.findByCode(dto.code);
    if (existingCode) {
      throw new BadRequestException('Subject code already exists');
    }

    return await this.academicSubjectRepository.save(dto);
  }

  async update(id: string, dto: UpdateAcademicSubjectDto): Promise<AcademicSubject> {
    const existingSubject = await this.findById(id);

    // Check code uniqueness if updating
    if (dto.code && dto.code !== existingSubject.code) {
      const subjectWithCode = await this.academicSubjectRepository.findByCode(dto.code);
      if (subjectWithCode) {
        throw new BadRequestException('Subject code already exists');
      }
    }

    return await this.academicSubjectRepository.update(id, dto);
  }

  async findByCode(code: string): Promise<AcademicSubject> {
    const subject = await this.academicSubjectRepository.findByCode(code);
    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }
    return subject;
  }

  async findBySemester(semester: number): Promise<AcademicSubject[]> {
    return await this.academicSubjectRepository.findBySemester(semester);
  }

  async findByKnowledgeArea(knowledgeArea: string): Promise<AcademicSubject[]> {
    return await this.academicSubjectRepository.findByKnowledgeArea(knowledgeArea);
  }

  async findAllWithRelations(): Promise<AcademicSubject[]> {
    return await this.academicSubjectRepository.findAllWithRelations();
  }

  async findByIdWithRelations(id: string): Promise<AcademicSubject> {
    const subject = await this.academicSubjectRepository.findByIdWithRelations(id);
    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    return subject;
  }
}
