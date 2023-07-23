import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';

@Injectable()
export class ParseIntDoctorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const type = value.type;

    if (type === 'doctor') {
      let experience = value.doctor.experience;
      let categoryId = value.doctor.categoryId;

      if (!this.isNumeric(experience) || !this.isNumeric(categoryId)) {
        throw new BadRequestException({
          message: 'Validation failed',
          errorCode: ErrorCodes.INVALID_VALIDATION,
        });
      }

      experience = parseInt(experience, 10);
      categoryId = parseInt(categoryId, 10);
      const specialties = value.doctor.specialties.map((value) => {
        if (!this.isNumeric(value)) {
          throw new BadRequestException({
            message: 'Validation failed',
            errorCode: ErrorCodes.INVALID_VALIDATION,
          });
        }

        return parseInt(value, 10);
      });

      value.doctor.experience = experience;
      value.doctor.categoryId = categoryId;
      value.doctor.specialties = specialties;
    }

    return value;
  }

  isNumeric(num: any): boolean {
    return !isNaN(num as number);
  }
}
