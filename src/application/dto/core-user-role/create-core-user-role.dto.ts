import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoreUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsOptional()
  assignedBy?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
