import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoreUserSessionService } from 'src/infrastructure/service/core-user-session.service';
import { CreateCoreUserSessionDto } from '../dto/core-user-session/create-core-user-session.dto';
import { UpdateCoreUserSessionDto } from '../dto/core-user-session/update-core-user-session.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-user-sessions')
@UseGuards(JwtAuthGuard)
export class CoreUserSessionController {
  constructor(private readonly coreUserSessionService: CoreUserSessionService) {}

  @Get()
  async findAll() {
    return await this.coreUserSessionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreUserSessionService.findById(id);
  }

  @Get('token/:token')
  async findByToken(@Param('token') token: string) {
    return await this.coreUserSessionService.findByToken(token);
  }

  @Get('user/:userId/active')
  async findActiveByUserId(@Param('userId') userId: string) {
    return await this.coreUserSessionService.findActiveByUserId(userId);
  }

  @Post()
  async create(@Body() dto: CreateCoreUserSessionDto) {
    return await this.coreUserSessionService.create(dto);
  }

  @Post('validate/:token')
  async validateSession(@Param('token') token: string) {
    return {
      valid: await this.coreUserSessionService.validateSession(token)
    };
  }

  @Post(':id/revoke')
  async revokeSession(@Param('id') id: string) {
    return await this.coreUserSessionService.revokeSession(id);
  }

  @Post('user/:userId/revoke-all')
  async revokeAllUserSessions(@Param('userId') userId: string) {
    await this.coreUserSessionService.revokeAllUserSessions(userId);
    return { message: 'All sessions revoked successfully' };
  }

  @Post('clean-expired')
  async cleanExpiredSessions() {
    await this.coreUserSessionService.cleanExpiredSessions();
    return { message: 'Expired sessions cleaned successfully' };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCoreUserSessionDto) {
    return await this.coreUserSessionService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coreUserSessionService.delete(id);
  }
}
