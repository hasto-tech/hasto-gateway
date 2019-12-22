import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidAuthTokenException extends HttpException {
  constructor() {
    super('Invalid auth token', HttpStatus.BAD_REQUEST);
  }
}
