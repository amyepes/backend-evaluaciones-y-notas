import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserType, Status } from 'generated/prisma';

export class UpdateCoreUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  username?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
