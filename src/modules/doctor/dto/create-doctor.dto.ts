import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DescriptionInfoDto } from './description-info.dto';

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

  @ValidateIf((o) => !!o.dateOfBirth)
  @IsDateString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  dateOfBirth: string;

  @IsNotEmpty()
  experience: number;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DescriptionInfoDto)
  description: DescriptionInfoDto;

  @IsNotEmpty()
  specialties: number[];

  @IsArray()
  @IsNotEmpty()
  clinicBranches: string[];

  @IsArray()
  @IsNotEmpty()
  cities: string[];
}
