import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateAcademicGradeDetailDto {
  @IsString()
  @IsNotEmpty()
  gradeId: string;

  @IsString()
  @IsNotEmpty()
  evaluationItemId: string;

  @IsObject()
  @IsOptional()
  studentAnswer?: any;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsNotEmpty()
  maxPoints: number;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @IsBoolean()
  @IsOptional()
  autoGraded?: boolean;

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsObject()
  @IsOptional()
  rubricScores?: any;

  @IsBoolean()
  @IsOptional()
  partialCredit?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  timeSpentSeconds?: number;

  @IsBoolean()
  @IsOptional()
  flaggedForReview?: boolean;

  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
