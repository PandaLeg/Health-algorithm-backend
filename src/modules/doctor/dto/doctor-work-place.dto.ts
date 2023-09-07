import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DoctorScheduleDto } from './doctor-schedule.dto';

export class DoctorWorkPlaceDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsUUID()
  id: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DoctorScheduleDto)
  schedule: DoctorScheduleDto[];
}
