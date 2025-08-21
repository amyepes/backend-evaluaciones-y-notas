import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoreUserRoleService } from 'src/infrastructure/service/core-user-role.service';
import { CreateCoreUserRoleDto } from '../dto/core-user-role/create-core-user-role.dto';
import { UpdateCoreUserRoleDto } from '../dto/core-user-role/update-core-user-role.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-user-roles')
@UseGuards(JwtAuthGuard)
export class CoreUserRoleController {
  constructor(private readonly coreUserRoleService: CoreUserRoleService) {}

  @Get()
  async findAll() {
    return await this.coreUserRoleService.findAll();
  }

  @Get('active')
  async findActiveNotExpired() {
    return await this.coreUserRoleService.findActiveNotExpired();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreUserRoleService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.coreUserRoleService.findByUserId(userId);
  }

  @Get('role/:roleId')
  async findByRoleId(@Param('roleId') roleId: string) {
    return await this.coreUserRoleService.findByRoleId(roleId);
  }

  @Post()
  async create(@Body() dto: CreateCoreUserRoleDto) {
    return await this.coreUserRoleService.create(dto);
  }

  @Post('assign')
  async assignRole(@Body() dto: { userId: string; roleId: string; assignedBy?: string; expiresAt?: string }) {
    return await this.coreUserRoleService.assignRole(
      dto.userId,
      dto.roleId,
      dto.assignedBy,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined
    );
  }

  @Post('revoke')
  async revokeRole(@Body() dto: { userId: string; roleId: string }) {
    return await this.coreUserRoleService.revokeRole(dto.userId, dto.roleId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCoreUserRoleDto) {
    return await this.coreUserRoleService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coreUserRoleService.delete(id);
  }
}
