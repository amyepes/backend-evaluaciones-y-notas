import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoreUserProfileService } from 'src/infrastructure/service/core-user-profile.service';
import { CreateCoreUserProfileDto } from '../dto/core-user-profile/create-core-user-profile.dto';
import { UpdateCoreUserProfileDto } from '../dto/core-user-profile/update-core-user-profile.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-user-profiles')
@UseGuards(JwtAuthGuard)
export class CoreUserProfileController {
  constructor(private readonly coreUserProfileService: CoreUserProfileService) {}

  @Get()
  async findAll() {
    return await this.coreUserProfileService.findAll();
  }

  @Get('with-user')
  async findAllWithUser() {
    return await this.coreUserProfileService.findAllWithUser();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreUserProfileService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.coreUserProfileService.findByUserId(userId);
  }

  @Get('document/:documentNumber')
  async findByDocumentNumber(@Param('documentNumber') documentNumber: string) {
    return await this.coreUserProfileService.findByDocumentNumber(documentNumber);
  }

  @Post()
  async create(@Body() dto: CreateCoreUserProfileDto) {
    return await this.coreUserProfileService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCoreUserProfileDto) {
    return await this.coreUserProfileService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coreUserProfileService.delete(id);
  }
}
