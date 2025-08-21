import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { $Enums } from "generated/prisma";

export class CreateUserDto{
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

    @IsEnum($Enums.UserType)
    @IsNotEmpty()
    userType: $Enums.UserType;
}