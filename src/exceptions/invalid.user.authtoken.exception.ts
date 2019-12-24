import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserAuthTokenException extends HttpException {
  constructor() {
    super('Invalid user auth token', HttpStatus.FORBIDDEN);
  }
}
