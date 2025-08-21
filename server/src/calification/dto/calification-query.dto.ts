import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class CalificationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El límite debe ser un número' })
  limit?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El ID del estudiante debe ser un número' })
  studentId?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El ID de la evaluación debe ser un número' })
  quizId?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El ID de la materia debe ser un número' })
  subjectId?: string;
}
