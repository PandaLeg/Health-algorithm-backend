import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserType } from '../../../base/types/user.type';

@ValidatorConstraint({ name: 'type', async: false })
export class ContainType implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'User type not found';
  }

  validate(
    value: UserType,
    arg?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return value === 'patient' || value === 'doctor' || value === 'clinic';
  }
}
