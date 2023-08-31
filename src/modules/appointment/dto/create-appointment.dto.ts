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
  doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  clinicBranchId: string;

  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  patientId: string;

  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  dateAppointment: string;

  @IsMilitaryTime()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  time: string;
}
