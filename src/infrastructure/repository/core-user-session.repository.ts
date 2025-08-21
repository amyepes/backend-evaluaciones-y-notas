import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreUserSession, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreUserSessionRepository extends BaseRepositoryImpl<CoreUserSession> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreUserSession');
  }

  async findByToken(token: string): Promise<CoreUserSession | null> {
    return await this.prisma.coreUserSession.findFirst({
      where: {
        token,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findActiveByUserId(userId: string): Promise<CoreUserSession[]> {
    return await this.prisma.coreUserSession.findMany({
      where: {
        userId,
        isActive: ActiveStatus.ACTIVE,
        expiresAt: { gte: new Date() },
        revokedAt: null
      }
    });
  }

  async revokeSession(id: string): Promise<CoreUserSession> {
    return await this.prisma.coreUserSession.update({
      where: { id },
      data: {
        revokedAt: new Date(),
        isActive: ActiveStatus.INACTIVE
      }
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.coreUserSession.updateMany({
      where: {
        userId,
        isActive: ActiveStatus.ACTIVE
      },
      data: {
        revokedAt: new Date(),
        isActive: ActiveStatus.INACTIVE
      }
    });
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.prisma.coreUserSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: ActiveStatus.ACTIVE
      },
      data: {
        isActive: ActiveStatus.INACTIVE
      }
    });
  }
}
