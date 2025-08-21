import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from 'generated/prisma';

export class UpdateCoreRoleDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  permissions?: any[];

  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
