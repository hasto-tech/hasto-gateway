import { HttpException, HttpStatus } from '@nestjs/common';

export class EmptyIdentityException extends HttpException {
  constructor() {
    super(
      'Impossible to proceed without a confirmed identity',
      HttpStatus.EXPECTATION_FAILED,
    );
  }
}
