import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../repository/base.repository';

export abstract class BaseService<T> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async create(data: any): Promise<T> {
    return await this.repository.save(data);
  }

  async update(id: string, data: any): Promise<T> {
    await this.findById(id); // Check if exists
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    await this.findById(id); // Check if exists
    return await this.repository.delete(id);
  }
}
