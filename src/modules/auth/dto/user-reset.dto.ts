import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Validate,
} from 'class-validator';
import { Match } from '../validators/match.validator';

export class UserResetDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(80, 80)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Validate(Match, ['password'])
  confirmPassword: string;
}
