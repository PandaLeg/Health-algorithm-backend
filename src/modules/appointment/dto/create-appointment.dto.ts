import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly clinicBranchId: string;

  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly patientId: string;

  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly dateAppointment: string;

  @IsMilitaryTime()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly time: string;
}
