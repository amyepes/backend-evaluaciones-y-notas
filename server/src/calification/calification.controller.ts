/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';
import { CalificationQueryDto } from './dto/calification-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/califications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CalificationController {
  constructor(private readonly calificationService: CalificationService) {}

  @Get()
  async getAllCalifications(@Query() query: CalificationQueryDto) {
    return await this.calificationService.getAllCalifications(query);
  }

  @Get('stats/overview')
  async getCalificationStats() {
    return await this.calificationService.getCalificationStats();
  }

  @Get(':id')
  async getCalificationById(@Param('id', ParseIntPipe) id: number) {
    return await this.calificationService.getCalificationById(id);
  }

  @Post()
  async createCalification(@Body() createCalificationDto: CreateCalificationDto) {
    return await this.calificationService.createCalification(createCalificationDto);
  }

  @Put(':id')
  async updateCalification(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalificationDto: UpdateCalificationDto,
  ) {
    return await this.calificationService.updateCalification(id, updateCalificationDto);
  }

  @Delete(':id')
  async deleteCalification(@Param('id', ParseIntPipe) id: number) {
    return await this.calificationService.deleteCalification(id);
  }

  @Get('quiz/:quizId')
  async getCalificationsByQuiz(@Param('quizId', ParseIntPipe) quizId: number) {
    return await this.calificationService.getCalificationsByQuiz(quizId);
  }
}
