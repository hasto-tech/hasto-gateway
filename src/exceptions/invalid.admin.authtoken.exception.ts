import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidAdminAuthTokenException extends HttpException {
  constructor() {
    super('Invalid admin auth token', HttpStatus.FORBIDDEN);
  }
}
