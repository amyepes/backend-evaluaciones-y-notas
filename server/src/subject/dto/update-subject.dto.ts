import { IsOptional, IsString, IsNumber, MaxLength, MinLength, IsPositive } from "class-validator";

export class UpdateSubjectDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    professorId?: number;
}
