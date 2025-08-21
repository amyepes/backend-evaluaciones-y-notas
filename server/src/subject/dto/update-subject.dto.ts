import { IsOptional, IsString, IsNumber, MaxLength } from "class-validator";

export class UpdateSubjectDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @IsNumber()
    @IsOptional()
    professorId?: number;
}
