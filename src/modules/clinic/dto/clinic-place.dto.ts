import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ClinicAddressDto } from './clinic-address.dto';

export class ClinicPlaceDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  city: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClinicAddressDto)
  addresses: ClinicAddressDto[];
}
