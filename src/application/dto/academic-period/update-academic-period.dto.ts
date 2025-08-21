import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PeriodType, PeriodStatus } from 'generated/prisma';

export class UpdateAcademicPeriodDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsEnum(PeriodType)
  @IsOptional()
  type?: PeriodType;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

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
