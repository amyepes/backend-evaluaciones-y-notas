import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { AcademicPeriod, PeriodStatus } from 'generated/prisma';
import { AcademicPeriodRepository } from '../repository/academic-period.repository';
import { CreateAcademicPeriodDto } from 'src/application/dto/academic-period/create-academic-period.dto';
import { UpdateAcademicPeriodDto } from 'src/application/dto/academic-period/update-academic-period.dto';

@Injectable()
export class AcademicPeriodService extends BaseService<AcademicPeriod> {
  constructor(private readonly academicPeriodRepository: AcademicPeriodRepository) {
    super(academicPeriodRepository);
  }

  async create(dto: CreateAcademicPeriodDto): Promise<AcademicPeriod> {
    // Check if code exists
    const existingCode = await this.academicPeriodRepository.findByCode(dto.code);
    if (existingCode) {
      throw new BadRequestException('Period code already exists');
    }

    // If setting as default, unset other defaults
    if (dto.isDefault) {
      const currentDefault = await this.academicPeriodRepository.findDefaultPeriod();
      if (currentDefault) {
        await this.academicPeriodRepository.update(currentDefault.id, { isDefault: false });
      }
    }

    return await this.academicPeriodRepository.save(dto);
  }

  async update(id: string, dto: UpdateAcademicPeriodDto): Promise<AcademicPeriod> {
    const existingPeriod = await this.findById(id);

    // Check code uniqueness if updating
    if (dto.code && dto.code !== existingPeriod.code) {
      const periodWithCode = await this.academicPeriodRepository.findByCode(dto.code);
      if (periodWithCode) {
        throw new BadRequestException('Period code already exists');
      }
    }

    // If setting as default, unset other defaults
    if (dto.isDefault && !existingPeriod.isDefault) {
      const currentDefault = await this.academicPeriodRepository.findDefaultPeriod();
      if (currentDefault && currentDefault.id !== id) {
        await this.academicPeriodRepository.update(currentDefault.id, { isDefault: false });
      }
    }

    return await this.academicPeriodRepository.update(id, dto);
  }

  async findByCode(code: string): Promise<AcademicPeriod> {
    const period = await this.academicPeriodRepository.findByCode(code);
    if (!period) {
      throw new NotFoundException(`Period with code ${code} not found`);
    }
    return period;
  }

  async findByStatus(status: PeriodStatus): Promise<AcademicPeriod[]> {
    return await this.academicPeriodRepository.findByStatus(status);
  }

  async findActivePeriods(): Promise<AcademicPeriod[]> {
    return await this.academicPeriodRepository.findActivePeriods();
  }

  async findDefaultPeriod(): Promise<AcademicPeriod> {
    const period = await this.academicPeriodRepository.findDefaultPeriod();
    if (!period) {
      throw new NotFoundException('No default period found');
    }
    return period;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AcademicPeriod[]> {
    return await this.academicPeriodRepository.findByDateRange(startDate, endDate);
  }

  async findAllWithRelations(): Promise<AcademicPeriod[]> {
    return await this.academicPeriodRepository.findAllWithRelations();
  }
}
