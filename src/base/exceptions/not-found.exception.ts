import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes.enum';

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCodes) {
    super({ message, errorCode }, HttpStatus.NOT_FOUND);
  }
}
