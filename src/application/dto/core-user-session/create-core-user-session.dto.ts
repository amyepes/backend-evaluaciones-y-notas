import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCoreUserSessionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  token: string;

  @IsString()
  @IsOptional()
  @MaxLength(45)
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;
}
