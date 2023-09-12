import { IsNotEmpty, IsString } from 'class-validator';

export class LastNameDto {
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  readonly specialtyId: number;

  @IsString()
  readonly lastName: string;
}
