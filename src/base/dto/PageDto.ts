import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PageDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly page: number;

  @IsNumberString()
  @IsNotEmpty()
  readonly perPage: number;
}
