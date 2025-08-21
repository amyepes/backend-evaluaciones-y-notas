import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { GenderType } from 'generated/prisma';

export class UpdateCoreUserProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  documentType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  documentNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  emergencyPhone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  zipCode?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  biography?: string;
}
