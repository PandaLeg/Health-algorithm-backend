import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ClinicScheduleDto } from './clinic-schedule.dto';

export class ClinicBranchDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly address: string;

  @IsArray()
  @IsNotEmpty()
  readonly conveniences: number[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClinicScheduleDto)
  readonly scheduleClinic: ClinicScheduleDto[];
}
