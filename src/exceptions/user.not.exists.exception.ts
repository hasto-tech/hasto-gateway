import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotExistsException extends HttpException {
  constructor() {
    super(
      'User with he given ethereum address does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
