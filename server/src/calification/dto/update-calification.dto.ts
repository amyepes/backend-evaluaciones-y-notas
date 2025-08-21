import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateCalificationDto {
  @IsOptional()
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(100, { message: 'La calificación máxima es 100' })
  grade?: number;
}
