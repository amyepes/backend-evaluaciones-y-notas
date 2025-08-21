import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserType, Status } from 'generated/prisma';

export class CreateCoreUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
