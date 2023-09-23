import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DescriptionInfoDto } from './description-info.dto';
import { DoctorWorkPlaceDto } from './doctor-work-place.dto';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
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
  @Min(10)
  readonly price: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DoctorWorkPlaceDto)
  readonly workPlace: DoctorWorkPlaceDto;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly city: string;
}
