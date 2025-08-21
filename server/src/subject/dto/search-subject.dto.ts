import { IsOptional, IsString, IsNumberString, MinLength, MaxLength } from "class-validator";

export class SearchSubjectDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    searchTerm: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;
}
