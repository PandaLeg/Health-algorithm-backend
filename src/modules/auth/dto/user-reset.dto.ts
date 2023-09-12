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
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @Length(80, 80)
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Validate(Match, ['password'])
  readonly confirmPassword: string;
}
