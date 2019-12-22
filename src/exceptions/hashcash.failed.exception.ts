import { HttpException, HttpStatus } from '@nestjs/common';

export class HashcashFailedException extends HttpException {
  constructor() {
    super('Invalid hashcash solution', HttpStatus.EXPECTATION_FAILED);
  }
}
