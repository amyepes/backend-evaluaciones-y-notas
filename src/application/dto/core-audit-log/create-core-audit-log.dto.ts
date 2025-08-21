import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCoreAuditLogDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  action: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  entity: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsObject()
  @IsOptional()
  oldValues?: any;

  @IsObject()
  @IsOptional()
  newValues?: any;

  @IsString()
  @IsOptional()
  @MaxLength(45)
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
