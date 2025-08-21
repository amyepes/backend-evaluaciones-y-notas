import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, IsPositive } from "class-validator";

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    subjectId: number;
}
