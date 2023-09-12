import { PageDto } from '../../../base/dto/PageDto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CurrentClinicBranchDto extends PageDto {
  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly id: string;

  @IsUUID()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly clinicBranchId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly city: string;
}
