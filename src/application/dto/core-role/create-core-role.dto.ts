import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Status } from 'generated/prisma';

export class CreateCoreRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

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
