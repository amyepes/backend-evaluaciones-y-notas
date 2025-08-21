import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreUserRole } from 'generated/prisma';
import { CoreUserRoleRepository } from '../repository/core-user-role.repository';
import { CreateCoreUserRoleDto } from 'src/application/dto/core-user-role/create-core-user-role.dto';
import { UpdateCoreUserRoleDto } from 'src/application/dto/core-user-role/update-core-user-role.dto';

@Injectable()
export class CoreUserRoleService extends BaseService<CoreUserRole> {
  constructor(private readonly coreUserRoleRepository: CoreUserRoleRepository) {
    super(coreUserRoleRepository);
  }

  async create(dto: CreateCoreUserRoleDto): Promise<CoreUserRole> {
    // Check if user-role combination already exists
    const existing = await this.coreUserRoleRepository.findByUserAndRole(dto.userId, dto.roleId);
    if (existing) {
      throw new BadRequestException('User already has this role assigned');
    }

    return await this.coreUserRoleRepository.save(dto);
  }

  async update(id: string, dto: UpdateCoreUserRoleDto): Promise<CoreUserRole> {
    await this.findById(id);
    return await this.coreUserRoleRepository.update(id, dto);
  }

  async findByUserId(userId: string): Promise<CoreUserRole[]> {
    return await this.coreUserRoleRepository.findByUserId(userId);
  }

  async findByRoleId(roleId: string): Promise<CoreUserRole[]> {
    return await this.coreUserRoleRepository.findByRoleId(roleId);
  }

  async findActiveNotExpired(): Promise<CoreUserRole[]> {
    return await this.coreUserRoleRepository.findActiveNotExpired();
  }

  async assignRole(userId: string, roleId: string, assignedBy?: string, expiresAt?: Date): Promise<CoreUserRole> {
    const dto: CreateCoreUserRoleDto = {
      userId,
      roleId,
      assignedBy,
      expiresAt: expiresAt?.toISOString()
    };
    return await this.create(dto);
  }

  async revokeRole(userId: string, roleId: string): Promise<CoreUserRole> {
    const userRole = await this.coreUserRoleRepository.findByUserAndRole(userId, roleId);
    if (!userRole) {
      throw new BadRequestException('User does not have this role');
    }
    return await this.delete(userRole.id);
  }
}
