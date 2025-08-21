import { IsNotEmpty, IsString, MaxLength, IsEnum, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    name?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
