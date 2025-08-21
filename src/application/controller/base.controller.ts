import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BaseService } from 'src/infrastructure/service/base.service';

export abstract class BaseController<T> {
  constructor(protected readonly service: BaseService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<T> {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: any): Promise<T> {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any): Promise<T> {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<T> {
    return await this.service.delete(id);
  }
}
