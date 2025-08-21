import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { EnrollmentStatus } from 'generated/prisma';

export class CreateAcademicEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  periodId: string;

  @IsDateString()
  @IsOptional()
  enrollmentDate?: string;

  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;

  @IsNumber()
  @IsOptional()
  finalGrade?: number;

  @IsNumber()
  @IsOptional()
  finalPercentage?: number;

  @IsInt()
  @IsOptional()
  creditsEarned?: number;

  @IsNumber()
  @IsOptional()
  attendanceRate?: number;

  @IsDateString()
  @IsOptional()
  droppedDate?: string;

  @IsString()
  @IsOptional()
  dropReason?: string;

  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @IsBoolean()
  @IsOptional()
  certificateIssued?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
