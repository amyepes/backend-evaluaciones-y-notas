import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ItemType, Status } from 'generated/prisma';

export class UpdateAcademicEvaluationItemDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  itemNumber?: number;

  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType;

  @IsString()
  @IsOptional()
  question?: string;

  @IsObject()
  @IsOptional()
  options?: any;

  @IsObject()
  @IsOptional()
  correctAnswer?: any;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsObject()
  @IsOptional()
  rubricCriteria?: any;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(20)
  difficultyLevel?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  learningObjective?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsInt()
  @IsOptional()
  @Min(1)
  timeLimit?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
