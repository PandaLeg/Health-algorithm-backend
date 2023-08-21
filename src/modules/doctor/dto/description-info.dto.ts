import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DescriptionInfoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  about: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  education: string;

  @ValidateIf((o) => !!o.course)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  course: string;
}
