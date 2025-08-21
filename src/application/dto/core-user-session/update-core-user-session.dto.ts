import { IsDateString, IsOptional } from 'class-validator';

export class UpdateCoreUserSessionDto {
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsDateString()
  @IsOptional()
  revokedAt?: string;
}
