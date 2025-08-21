import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { QualitativeGrade, GradeStatus } from 'generated/prisma';

export class CreateAcademicGradeDto {
  @IsString()
  @IsNotEmpty()
  evaluationId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  maxPossibleScore: number;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsEnum(QualitativeGrade)
  @IsOptional()
  qualitativeGrade?: QualitativeGrade;

  @IsInt()
  @IsOptional()
  @Min(1)
  attemptNumber?: number;

  @IsDateString()
  @IsOptional()
  submittedAt?: string;

  @IsDateString()
  @IsOptional()
  gradedAt?: string;

  @IsString()
  @IsOptional()
  gradedBy?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  timeSpentMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isLateSubmission?: boolean;

  @IsNumber()
  @IsOptional()
  latePenalty?: number;

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsString()
  @IsOptional()
  privateNotes?: string;

  @IsEnum(GradeStatus)
  @IsOptional()
  status?: GradeStatus;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
