import { IsString, MaxLength, IsEnum, IsOptional, MinLength } from "class-validator";
import { Role } from "@prisma/client";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    @MinLength(2)
    name?: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(100)
    password?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
