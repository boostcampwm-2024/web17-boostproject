import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { OpenapiException } from '../util/openapiCustom.error';

@Catch()
export class OpenapiExceptionFilter implements ExceptionFilter {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  catch(exception: unknown) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const error =
      exception instanceof OpenapiException ? exception.getError() : '';

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)} Error : ${error}`,
    );
  }
}
