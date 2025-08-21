import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreRole } from 'generated/prisma';
import { CoreRoleRepository } from '../repository/core-role.repository';
import { CreateCoreRoleDto } from 'src/application/dto/core-role/create-core-role.dto';
import { UpdateCoreRoleDto } from 'src/application/dto/core-role/update-core-role.dto';

@Injectable()
export class CoreRoleService extends BaseService<CoreRole> {
  constructor(private readonly coreRoleRepository: CoreRoleRepository) {
    super(coreRoleRepository);
  }

  async create(dto: CreateCoreRoleDto): Promise<CoreRole> {
    // Check if role name exists
    const existingRole = await this.coreRoleRepository.findByName(dto.name);
    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    return await this.coreRoleRepository.save(dto);
  }

  async update(id: string, dto: UpdateCoreRoleDto): Promise<CoreRole> {
    const existingRole = await this.findById(id);

    // Check if it's a system role
    if (existingRole.isSystem) {
      throw new BadRequestException('System roles cannot be modified');
    }

    // Check role name uniqueness if updating
    if (dto.name && dto.name !== existingRole.name) {
      const roleWithName = await this.coreRoleRepository.findByName(dto.name);
      if (roleWithName) {
        throw new BadRequestException('Role name already exists');
      }
    }

    return await this.coreRoleRepository.update(id, dto);
  }

  async delete(id: string): Promise<CoreRole> {
    const role = await this.findById(id);
    
    // Check if it's a system role
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    return await this.coreRoleRepository.delete(id);
  }

  async findByName(name: string): Promise<CoreRole> {
    const role = await this.coreRoleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async findSystemRoles(): Promise<CoreRole[]> {
    return await this.coreRoleRepository.findSystemRoles();
  }

  async findAllWithUsers(): Promise<CoreRole[]> {
    return await this.coreRoleRepository.findAllWithUsers();
  }
}
