import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CoreAuditLogService } from 'src/infrastructure/service/core-audit-log.service';
import { CreateCoreAuditLogDto } from '../dto/core-audit-log/create-core-audit-log.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('core-audit-logs')
@UseGuards(JwtAuthGuard)
export class CoreAuditLogController {
  constructor(private readonly coreAuditLogService: CoreAuditLogService) {}

  @Get()
  async findAll() {
    return await this.coreAuditLogService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.coreAuditLogService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.coreAuditLogService.findByUserId(userId);
  }

  @Get('entity/:entity')
  async findByEntity(
    @Param('entity') entity: string,
    @Query('entityId') entityId?: string
  ) {
    return await this.coreAuditLogService.findByEntity(entity, entityId);
  }

  @Get('action/:action')
  async findByAction(@Param('action') action: string) {
    return await this.coreAuditLogService.findByAction(action);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return await this.coreAuditLogService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Post()
  async create(@Body() dto: CreateCoreAuditLogDto) {
    return await this.coreAuditLogService.create(dto);
  }

  @Post('log')
  async logAction(@Body() dto: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return await this.coreAuditLogService.logAction(
      dto.action,
      dto.entity,
      dto.entityId,
      dto.userId,
      dto.oldValues,
      dto.newValues,
      dto.ipAddress,
      dto.userAgent
    );
  }
}
