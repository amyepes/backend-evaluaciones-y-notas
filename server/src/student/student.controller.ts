/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('my-subjects')
  async getMySubjects(@Request() req: any) {
    const studentId = req.user.sub;
    return await this.studentService.getStudentSubjects(studentId);
  }

  @Get('subject/:subjectId/quizzes')
  async getSubjectQuizzes(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Request() req: any,
  ) {
    const studentId = req.user.sub;
    return await this.studentService.getSubjectQuizzesWithGrades(subjectId, studentId);
  }

  @Get('my-grades')
  async getMyGrades(@Request() req: any) {
    const studentId = req.user.sub;
    return await this.studentService.getStudentGrades(studentId);
  }

  @Get('subject/:subjectId/stats')
  async getSubjectStats(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Request() req: any,
  ) {
    const studentId = req.user.sub;
    return await this.studentService.getStudentSubjectStats(subjectId, studentId);
  }
}
