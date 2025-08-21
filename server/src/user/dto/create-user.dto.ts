import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}