import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { GenderType } from 'generated/prisma';

export class CreateCoreUserProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

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
