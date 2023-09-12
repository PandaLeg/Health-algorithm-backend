import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
