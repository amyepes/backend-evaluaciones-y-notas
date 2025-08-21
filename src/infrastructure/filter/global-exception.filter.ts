import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      this.logger.error(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'unexpected error, please try again later';
    }

    response.status(status).json({
      status_code: status,
      message: message
    });
  }
}
