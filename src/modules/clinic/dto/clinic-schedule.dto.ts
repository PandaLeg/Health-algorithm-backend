import { IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class ClinicScheduleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  dayType: string;

  @ValidateIf((o) => o.dayType === 'Workday')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  from: string;

  @ValidateIf((o) => o.dayType === 'Workday')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  to: string;

  @IsArray()
  @IsNotEmpty()
  weekDays: number[];
}
