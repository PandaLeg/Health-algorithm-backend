import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DoctorAddressDto } from './doctor-address.dto';

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

  dateOfBirth: string;

  @IsNotEmpty()
  experience: number;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  specialties: number[];

  @ValidateNested()
  @Type(() => DoctorAddressDto)
  locations: DoctorAddressDto[];
}
