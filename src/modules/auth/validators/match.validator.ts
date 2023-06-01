import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'match', async: false })
export class Match implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const [propertyName] = args.constraints;
    const relatedPropertyValue = args.object[propertyName];

    return value === relatedPropertyValue;
  }
}
