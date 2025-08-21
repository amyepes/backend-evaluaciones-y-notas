import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreAuditLog, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreAuditLogRepository extends BaseRepositoryImpl<CoreAuditLog> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreAuditLog');
  }

  async findByUserId(userId: string): Promise<CoreAuditLog[]> {
    return await this.prisma.coreAuditLog.findMany({
      where: {
        userId,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByEntity(entity: string, entityId?: string): Promise<CoreAuditLog[]> {
    return await this.prisma.coreAuditLog.findMany({
      where: {
        entity,
        ...(entityId && { entityId }),
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByAction(action: string): Promise<CoreAuditLog[]> {
    return await this.prisma.coreAuditLog.findMany({
      where: {
        action,
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<CoreAuditLog[]> {
    return await this.prisma.coreAuditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        isActive: ActiveStatus.ACTIVE
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createLog(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<CoreAuditLog> {
    return await this.prisma.coreAuditLog.create({
      data
    });
  }
}
