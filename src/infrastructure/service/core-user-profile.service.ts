import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreUserProfile } from 'generated/prisma';
import { CoreUserProfileRepository } from '../repository/core-user-profile.repository';
import { CreateCoreUserProfileDto } from 'src/application/dto/core-user-profile/create-core-user-profile.dto';
import { UpdateCoreUserProfileDto } from 'src/application/dto/core-user-profile/update-core-user-profile.dto';

@Injectable()
export class CoreUserProfileService extends BaseService<CoreUserProfile> {
  constructor(private readonly coreUserProfileRepository: CoreUserProfileRepository) {
    super(coreUserProfileRepository);
  }

  async create(dto: CreateCoreUserProfileDto): Promise<CoreUserProfile> {
    // Check if profile already exists for user
    const existingProfile = await this.coreUserProfileRepository.findByUserId(dto.userId);
    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Check document number uniqueness if provided
    if (dto.documentNumber) {
      const existingDocument = await this.coreUserProfileRepository.findByDocumentNumber(dto.documentNumber);
      if (existingDocument) {
        throw new BadRequestException('Document number already exists');
      }
    }

    return await this.coreUserProfileRepository.save(dto);
  }

  async update(id: string, dto: UpdateCoreUserProfileDto): Promise<CoreUserProfile> {
    const existingProfile = await this.findById(id);

    // Check document number uniqueness if updating
    if (dto.documentNumber && dto.documentNumber !== existingProfile.documentNumber) {
      const existingDocument = await this.coreUserProfileRepository.findByDocumentNumber(dto.documentNumber);
      if (existingDocument) {
        throw new BadRequestException('Document number already exists');
      }
    }

    return await this.coreUserProfileRepository.update(id, dto);
  }

  async findByUserId(userId: string): Promise<CoreUserProfile> {
    const profile = await this.coreUserProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    return profile;
  }

  async findByDocumentNumber(documentNumber: string): Promise<CoreUserProfile> {
    const profile = await this.coreUserProfileRepository.findByDocumentNumber(documentNumber);
    if (!profile) {
      throw new NotFoundException(`Profile with document number ${documentNumber} not found`);
    }
    return profile;
  }

  async findAllWithUser(): Promise<CoreUserProfile[]> {
    return await this.coreUserProfileRepository.findAllWithUser();
  }
}
