import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/services/jwt.service';
import { InvalidUserAuthTokenException } from 'src/exceptions/invalid.user.authtoken.exception';

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken: string = request.headers.authtoken;
    const decoded = this.jwtService.decodeToken(authToken);

    if (!decoded.ethereumAddress) {
      throw new InvalidUserAuthTokenException();
    }
    if (decoded.role !== 'user') {
      throw new InvalidUserAuthTokenException();
    }

    return true;
  }
}
