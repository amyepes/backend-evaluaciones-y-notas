import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EvaluationType, EvaluationStatus } from 'generated/prisma';

export class CreateAcademicEvaluationDto {
  @IsString()
  @IsNotEmpty()
  periodId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsEnum(EvaluationType)
  @IsNotEmpty()
  type: EvaluationType;

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
