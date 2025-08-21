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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectQueryDto } from './dto/subject-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
@Roles(Role.ADMIN)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async getAllSubjects(@Query() query: SubjectQueryDto) {
    return await this.subjectService.getAllSubjects(query);
  }

  @Get(':id')
  async getSubjectById(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.getSubjectById(id);
  }

  @Post()
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return await this.subjectService.createSubject(createSubjectDto);
  }

  @Put(':id')
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return await this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.deleteSubject(id);
  }

  @Post(':subjectId/students/:studentId')
  async assignStudentToSubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return await this.subjectService.assignStudentToSubject(subjectId, studentId);
  }

  @Delete(':subjectId/students/:studentId')
  async removeStudentFromSubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return await this.subjectService.removeStudentFromSubject(subjectId, studentId);
  }

  @Get('stats/overview')
  async getSubjectStats() {
    return await this.subjectService.getSubjectStats();
  }

  @Get('professor/:professorId')
  async getSubjectsByProfessor(@Param('professorId', ParseIntPipe) professorId: number) {
    return await this.subjectService.getSubjectsByProfessor(professorId);
  }

  @Get(':id/students')
  async getSubjectStudents(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.getSubjectStudents(id);
  }

  @Get('search/:searchTerm')
  async searchSubjects(
    @Param('searchTerm') searchTerm: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : 10;
    return await this.subjectService.searchSubjects(searchTerm, limitNumber);
  }
}
