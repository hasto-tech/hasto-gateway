import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/services/jwt.service';

import { InvalidAdminAuthTokenException } from '../exceptions/invalid.admin.authtoken.exception';
import { ADMIN_ROLE_TOKEN } from 'src/utils/constants';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken: string = request.headers.authtoken;
    const decoded = this.jwtService.decodeToken(authToken);

    if (!decoded.publicKey) {
      throw new InvalidAdminAuthTokenException();
    }
    if (decoded.role !== ADMIN_ROLE_TOKEN) {
      throw new InvalidAdminAuthTokenException();
    }

    return true;
  }
}
