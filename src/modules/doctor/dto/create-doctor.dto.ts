import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DescriptionInfoDto } from './description-info.dto';
import { DoctorWorkPlaceDto } from './doctor-work-place.dto';

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

  @IsInt()
  @IsNotEmpty()
  experience: number;

  @IsInt()
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
  @ValidateNested({ each: true })
  @Type(() => DoctorWorkPlaceDto)
  doctorWorkPlaces: DoctorWorkPlaceDto[];

  @IsArray()
  @IsNotEmpty()
  cities: string[];
}
