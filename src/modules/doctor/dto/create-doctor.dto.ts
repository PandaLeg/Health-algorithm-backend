import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  surname: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  experience: number;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  categoryId: number;

  @IsNotEmpty()
  specialties: number[];
}
