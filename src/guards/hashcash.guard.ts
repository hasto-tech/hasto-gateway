import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HashcashService } from 'src/services/hashcash.service';
import { HashcashFailedException } from 'src/exceptions/hashcash.failed.exception';

@Injectable()
export class HashcashGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const hashcashSolution = request.headers.hashcash;

    if (!HashcashService.verify(4, 2, hashcashSolution)) {
      throw new HashcashFailedException();
    }
    return true;
  }
}
