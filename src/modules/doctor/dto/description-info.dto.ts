import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DescriptionInfoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly about: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly education: string;

  @ValidateIf((o) => !!o.course)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly course: string;
}
