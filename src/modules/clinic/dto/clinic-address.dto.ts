import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ClinicScheduleDto } from './clinic-schedule.dto';

export class ClinicAddressDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClinicScheduleDto)
  scheduleClinic: ClinicScheduleDto[];
}
