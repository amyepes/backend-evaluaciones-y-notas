import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class AssignStudentDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    studentId: number;
}
