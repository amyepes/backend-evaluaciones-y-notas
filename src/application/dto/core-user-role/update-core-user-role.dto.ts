import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateCoreUserRoleDto {
  @IsString()
  @IsOptional()
  assignedBy?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
