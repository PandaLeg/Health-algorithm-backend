import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { DoctorScheduleDto } from './doctor-schedule.dto';

export class DoctorWorkPlaceDto {
  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly id: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DoctorScheduleDto)
  readonly schedule: DoctorScheduleDto[];
}
