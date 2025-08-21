import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoreUserService } from 'src/infrastructure/service/core-user.service';
import { CreateCoreUserDto } from '../dto/core-user/create-core-user.dto';
import { UpdateCoreUserDto } from '../dto/core-user/update-core-user.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-users')
@UseGuards(JwtAuthGuard)
export class CoreUserController {
  constructor(private readonly coreUserService: CoreUserService) {}

  @Get()
  async findAll() {
    return await this.coreUserService.findAll();
  }

  @Get('with-relations')
  async findAllWithRelations() {
    return await this.coreUserService.findAllWithRelations();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreUserService.findByIdSafe(id);
  }

  @Get(':id/with-relations')
  async findByIdWithRelations(@Param('id') id: string) {
    return await this.coreUserService.findByIdWithRelations(id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.coreUserService.findByUsername(username);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.coreUserService.findByEmail(email);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  @Post()
  async create(@Body() dto: CreateCoreUserDto) {
    return await this.coreUserService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCoreUserDto) {
    return await this.coreUserService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coreUserService.delete(id);
  }
}
