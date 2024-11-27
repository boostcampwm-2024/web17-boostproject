import { HttpException, HttpStatus } from '@nestjs/common';

export class OpenapiException extends HttpException {
  private error: unknown;
  constructor(message: string, status: HttpStatus, error?: unknown) {
    super(message, status);
    this.error = error;
  }

  public getError() {
    return this.error;
  }
}
