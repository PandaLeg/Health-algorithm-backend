import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status);

    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.NOT_FOUND) {
      return response.json({
        message: exception.response.message,
        errorCode: exception.response.errorCode,
      });
    }

    return response.json({
      message: 'Internal server error',
    });
  }
}
