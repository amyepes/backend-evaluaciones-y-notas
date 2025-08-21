import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreRole, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreRoleRepository extends BaseRepositoryImpl<CoreRole> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreRole');
  }

  async findByName(name: string): Promise<CoreRole | null> {
    return await this.prisma.coreRole.findFirst({
      where: {
        name,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findSystemRoles(): Promise<CoreRole[]> {
    return await this.prisma.coreRole.findMany({
      where: {
        isSystem: true,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findAllWithUsers(): Promise<CoreRole[]> {
    return await this.prisma.coreRole.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        userRoles: {
          include: {
            user: true
          }
        }
      }
    });
  }
}
