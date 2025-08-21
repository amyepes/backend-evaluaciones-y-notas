import { IsOptional, IsString, IsEnum, IsNumberString } from "class-validator";
import { Role } from "@prisma/client";

export class UserQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
