import { IsOptional, IsString, IsNumberString } from "class-validator";

export class SubjectQueryDto {
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
    professorId?: string;
}
