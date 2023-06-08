import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ErrorCodes } from '../exceptions/error-codes.enum';

@Injectable()
export class GeneralValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const obj = plainToInstance(metatype, value);
    const errors: ValidationError[] = await validate(obj);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errorCode: ErrorCodes.INVALID_VALIDATION,
      });
    }

    return value;
  }

  toValidate(metatype: Type): boolean {
    const types: Type[] = [Array, Number, Object, Boolean, String];

    return !types.includes(metatype);
  }
}
