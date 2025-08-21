import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}
