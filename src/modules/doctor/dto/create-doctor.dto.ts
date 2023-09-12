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
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly surname: string;

  @ValidateIf((o) => !!o.dateOfBirth)
  @IsDateString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly dateOfBirth: string;

  @IsInt()
  @IsNotEmpty()
  readonly experience: number;

  @IsInt()
  @IsNotEmpty()
  readonly categoryId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DescriptionInfoDto)
  readonly description: DescriptionInfoDto;

  @IsNotEmpty()
  readonly specialties: number[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DoctorWorkPlaceDto)
  readonly doctorWorkPlaces: DoctorWorkPlaceDto[];

  @IsArray()
  @IsNotEmpty()
  readonly cities: string[];
}
