import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { OpenapiException } from '../util/openapiCustom.error';

@Catch()
export class OpenapiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(OpenapiExceptionFilter.name);

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
