import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UA')
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
