import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ClinicPlaceDto } from './clinic-place.dto';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClinicPlaceDto)
  locations: ClinicPlaceDto[];
}
