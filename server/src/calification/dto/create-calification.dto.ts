import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateCalificationDto {
  @IsInt({ message: 'El ID del estudiante debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
  studentId: number;

  @IsInt({ message: 'El ID de la evaluación debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la evaluación es requerido' })
  quizId: number;

  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(100, { message: 'La calificación máxima es 100' })
  grade: number;
}
