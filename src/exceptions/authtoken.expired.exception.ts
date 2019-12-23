import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthTokenExpiredException extends HttpException {
  constructor() {
    super('Auth token expired', HttpStatus.BAD_REQUEST);
  }
}
