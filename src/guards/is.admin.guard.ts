import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/services/jwt.service';

import { InvalidAdminAuthTokenException } from '../exceptions/invalid.admin.authtoken.exception';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken: string = request.headers.authtoken;
    const decoded = this.jwtService.decodeToken(authToken);

    if (!decoded.adminAddress) {
      throw new InvalidAdminAuthTokenException();
    }
    if (decoded.role !== 'admin') {
      throw new InvalidAdminAuthTokenException();
    }

    return true;
  }
}
