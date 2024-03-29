import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ClinicBranchDto } from './clinic-branch.dto';

export class ClinicPlaceDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly city: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClinicBranchDto)
  readonly clinicBranches: ClinicBranchDto[];
}
