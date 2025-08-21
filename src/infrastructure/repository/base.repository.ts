import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { ActiveStatus } from 'generated/prisma';

export interface BaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  save(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}

@Injectable()
export abstract class BaseRepositoryImpl<T> implements BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {}

  async findAll(): Promise<T[]> {
    return await this.prisma[this.modelName].findMany({
      where: {
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async findById(id: string): Promise<T | null> {
    return await this.prisma[this.modelName].findFirst({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE
      }
    });
  }

  async save(data: any): Promise<T> {
    return await this.prisma[this.modelName].create({
      data
    });
  }

  async update(id: string, data: any): Promise<T> {
    return await this.prisma[this.modelName].update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<T> {
    return await this.prisma[this.modelName].update({
      where: { id },
      data: {
        isActive: ActiveStatus.INACTIVE
      }
    });
  }
}
