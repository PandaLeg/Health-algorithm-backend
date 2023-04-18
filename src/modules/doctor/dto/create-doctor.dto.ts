import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsInt()
  @IsNotEmpty()
  experience: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsArray()
  @IsNotEmpty()
  specialties: number[];
}
