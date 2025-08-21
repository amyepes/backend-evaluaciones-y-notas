import { IsNotEmpty, IsString, MaxLength, IsEnum, IsOptional, MinLength } from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(2)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}