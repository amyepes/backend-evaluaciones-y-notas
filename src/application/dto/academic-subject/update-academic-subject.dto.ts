import { IsArray, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Status } from 'generated/prisma';

export class UpdateAcademicSubjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  credits?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  weeklyHours?: number;

  @IsInt()
  @IsOptional()
  semester?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  knowledgeArea?: string;

  @IsArray()
  @IsOptional()
  prerequisites?: string[];

  @IsArray()
  @IsOptional()
  corequisites?: string[];

  @IsArray()
  @IsOptional()
  learningObjectives?: string[];

  @IsString()
  @IsOptional()
  syllabus?: string;

  @IsArray()
  @IsOptional()
  bibliography?: any[];

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
