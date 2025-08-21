import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { QualitativeGrade, GradeStatus } from 'generated/prisma';

export class UpdateAcademicGradeDto {
  @IsNumber()
  @IsOptional()
  score?: number;

  @IsNumber()
  @IsOptional()
  maxPossibleScore?: number;

  @IsNumber()
  @IsOptional()
  percentage?: number;

  @IsEnum(QualitativeGrade)
  @IsOptional()
  qualitativeGrade?: QualitativeGrade;

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
