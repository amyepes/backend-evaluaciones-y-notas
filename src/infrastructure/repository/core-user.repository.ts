import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreUser, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreUserRepository extends BaseRepositoryImpl<CoreUser> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreUser');
  }

  async findByUsername(username: string): Promise<CoreUser | null> {
    return await this.prisma.coreUser.findFirst({
      where: {
        username,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByEmail(email: string): Promise<CoreUser | null> {
    return await this.prisma.coreUser.findFirst({
      where: {
        email,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findAllWithRelations(): Promise<CoreUser[]> {
    return await this.prisma.coreUser.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        profile: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async findByIdWithRelations(id: string): Promise<CoreUser | null> {
    return await this.prisma.coreUser.findFirst({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        profile: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }
}
