import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoreRoleService } from 'src/infrastructure/service/core-role.service';
import { CreateCoreRoleDto } from '../dto/core-role/create-core-role.dto';
import { UpdateCoreRoleDto } from '../dto/core-role/update-core-role.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-roles')
@UseGuards(JwtAuthGuard)
export class CoreRoleController {
  constructor(private readonly coreRoleService: CoreRoleService) {}

  @Get()
  async findAll() {
    return await this.coreRoleService.findAll();
  }

  @Get('system')
  async findSystemRoles() {
    return await this.coreRoleService.findSystemRoles();
  }

  @Get('with-users')
  async findAllWithUsers() {
    return await this.coreRoleService.findAllWithUsers();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreRoleService.findById(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return await this.coreRoleService.findByName(name);
  }

  @Post()
  async create(@Body() dto: CreateCoreRoleDto) {
    return await this.coreRoleService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCoreRoleDto) {
    return await this.coreRoleService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coreRoleService.delete(id);
  }
}
