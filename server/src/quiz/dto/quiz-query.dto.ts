import { IsOptional, IsString, IsNumberString } from "class-validator";

export class QuizQueryDto {
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
    @IsNumberString()
    subjectId?: string;
}
