import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes.enum';

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCodes) {
    super({ message, errorCode }, HttpStatus.BAD_REQUEST);
  }
}
