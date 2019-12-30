import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { isSecp256k1PubKey } from 'src/utils/custom-validators';
import { publicKey } from 'eth-crypto';

@Injectable()
export class IsValidPublicKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const publicKey = request.headers.publickey;

    if (!publicKey) {
      throw new HttpException(
        'No public key has been given',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isSecp256k1PubKey(publicKey)) {
      throw new HttpException(
        'Invalid public key format',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
