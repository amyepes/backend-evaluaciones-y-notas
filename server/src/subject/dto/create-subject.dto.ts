import { IsNotEmpty, IsString, IsNumber, MaxLength, MinLength, IsPositive } from "class-validator";

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    professorId: number;
}
