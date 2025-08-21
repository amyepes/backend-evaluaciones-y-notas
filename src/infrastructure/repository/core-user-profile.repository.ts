import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository';
import { CoreUserProfile, ActiveStatus } from 'generated/prisma';
import { PrismaService } from '../service/prisma.service';

@Injectable()
export class CoreUserProfileRepository extends BaseRepositoryImpl<CoreUserProfile> {
  constructor(prisma: PrismaService) {
    super(prisma, 'coreUserProfile');
  }

  async findByUserId(userId: string): Promise<CoreUserProfile | null> {
    return await this.prisma.coreUserProfile.findFirst({
      where: {
        userId,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findByDocumentNumber(documentNumber: string): Promise<CoreUserProfile | null> {
    return await this.prisma.coreUserProfile.findFirst({
      where: {
        documentNumber,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findAllWithUser(): Promise<CoreUserProfile[]> {
    return await this.prisma.coreUserProfile.findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      },
      include: {
        user: true
      }
    });
  }
}
