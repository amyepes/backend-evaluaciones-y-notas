import { IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAcademicGradeDetailDto {
  @IsObject()
  @IsOptional()
  studentAnswer?: any;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  maxPoints?: number;

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
