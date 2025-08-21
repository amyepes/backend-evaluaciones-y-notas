import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PeriodType, PeriodStatus } from 'generated/prisma';

export class CreateAcademicPeriodDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEnum(PeriodType)
  @IsNotEmpty()
  type: PeriodType;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsEnum(PeriodStatus)
  @IsOptional()
  status?: PeriodStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
