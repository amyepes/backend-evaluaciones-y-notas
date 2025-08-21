import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreUserRole, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreUserRoleRepository extends BaseRepositoryImpl<CoreUserRole> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreUserRole');
  }

  async findByUserAndRole(userId: string, roleId: string): Promise<CoreUserRole | null> {
    return await this.prisma.coreUserRole.findFirst({
      where: {
        userId,
        roleId,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByUserId(userId: string): Promise<CoreUserRole[]> {
    return await this.prisma.coreUserRole.findMany({
      where: {
        userId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        role: true
      }
    });
  }

  async findByRoleId(roleId: string): Promise<CoreUserRole[]> {
    return await this.prisma.coreUserRole.findMany({
      where: {
        roleId,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        user: true
      }
    });
  }

  async findActiveNotExpired(): Promise<CoreUserRole[]> {
    return await this.prisma.coreUserRole.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      include: {
        user: true,
        role: true
      }
    });
  }
}
