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
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizQueryDto } from './dto/quiz-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getAllQuizzes(@Query() query: QuizQueryDto) {
    return await this.quizService.getAllQuizzes(query);
  }

  @Get(':id')
  async getQuizById(@Param('id', ParseIntPipe) id: number) {
    return await this.quizService.getQuizById(id);
  }

  @Post()
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return await this.quizService.createQuiz(createQuizDto);
  }

  @Put(':id')
  async updateQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return await this.quizService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id', ParseIntPipe) id: number) {
    return await this.quizService.deleteQuiz(id);
  }

  @Get('subject/:subjectId')
  async getQuizzesBySubject(@Param('subjectId', ParseIntPipe) subjectId: number) {
    return await this.quizService.getQuizzesBySubject(subjectId);
  }
}
