import { IsNotEmpty, IsString } from 'class-validator';

export class LastNameDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  specialtyId: number;

  @IsString()
  lastName: string;
}
