import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EvaluationType, EvaluationStatus } from 'generated/prisma';

export class UpdateAcademicEvaluationDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsEnum(EvaluationType)
  @IsOptional()
  type?: EvaluationType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  durationMinutes?: number;

  @IsNumber()
  @IsOptional()
  maxScore?: number;

  @IsNumber()
  @IsOptional()
  passingScore?: number;

  @IsNumber()
  @IsOptional()
  weightPercentage?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  maxAttempts?: number;

  @IsBoolean()
  @IsOptional()
  allowLateSubmission?: boolean;

  @IsNumber()
  @IsOptional()
  latePenaltyPercentage?: number;

  @IsBoolean()
  @IsOptional()
  showResultsToStudents?: boolean;

  @IsBoolean()
  @IsOptional()
  randomizeQuestions?: boolean;

  @IsEnum(EvaluationStatus)
  @IsOptional()
  status?: EvaluationStatus;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
