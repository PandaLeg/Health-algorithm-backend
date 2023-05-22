import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from './error-codes.enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status);

    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND) {
      const errorResponse = {
        message: exception.response?.message ?? 'Validation failed',
        errorCode:
          exception.response?.errorCode ?? ErrorCodes.INVALID_VALIDATION,
      };

      return response.json(errorResponse);
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.json({
        message: 'Unauthorized',
      });
    }

    return response.json({
      message: 'Internal server error',
    });
  }
}
