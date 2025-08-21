import { IsNotEmpty, IsString, IsNumber, MaxLength } from "class-validator";

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    professorId: number;
}
