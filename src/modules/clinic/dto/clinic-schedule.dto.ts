import { IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class ClinicScheduleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly dayType: string;

  @ValidateIf((o) => o.dayType === 'Workday')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly from: string;

  @ValidateIf((o) => o.dayType === 'Workday')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly to: string;

  @IsArray()
  @IsNotEmpty()
  readonly weekDays: number[];
}
