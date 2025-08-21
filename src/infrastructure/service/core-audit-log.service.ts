import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreAuditLog } from 'generated/prisma';
import { CoreAuditLogRepository } from '../repository/core-audit-log.repository';
import { CreateCoreAuditLogDto } from 'src/application/dto/core-audit-log/create-core-audit-log.dto';

@Injectable()
export class CoreAuditLogService extends BaseService<CoreAuditLog> {
  constructor(private readonly coreAuditLogRepository: CoreAuditLogRepository) {
    super(coreAuditLogRepository);
  }

  async create(dto: CreateCoreAuditLogDto): Promise<CoreAuditLog> {
    return await this.coreAuditLogRepository.createLog(dto);
  }

  async findByUserId(userId: string): Promise<CoreAuditLog[]> {
    return await this.coreAuditLogRepository.findByUserId(userId);
  }

  async findByEntity(entity: string, entityId?: string): Promise<CoreAuditLog[]> {
    return await this.coreAuditLogRepository.findByEntity(entity, entityId);
  }

  async findByAction(action: string): Promise<CoreAuditLog[]> {
    return await this.coreAuditLogRepository.findByAction(action);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<CoreAuditLog[]> {
    return await this.coreAuditLogRepository.findByDateRange(startDate, endDate);
  }

  async logAction(
    action: string,
    entity: string,
    entityId?: string,
    userId?: string,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CoreAuditLog> {
    return await this.create({
      action,
      entity,
      entityId,
      userId,
      oldValues,
      newValues,
      ipAddress,
      userAgent
    });
  }

  // Audit logs should not be updated
  async update(id: string, dto: any): Promise<CoreAuditLog> {
    throw new Error('Audit logs cannot be updated');
  }
}
