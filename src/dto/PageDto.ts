import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PageDto {
  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @IsNumberString()
  @IsNotEmpty()
  perPage: number;
}
