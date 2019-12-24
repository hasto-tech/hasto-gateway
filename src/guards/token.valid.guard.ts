import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/services/jwt.service';
import { AuthTokenExpiredException } from 'src/exceptions/authtoken.expired.exception';
import { InvalidAuthTokenException } from 'src/exceptions/invalid.authtoken.exception';

@Injectable()
export class IsTokenValidGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken: string = request.headers.authtoken;
    const decoded = this.jwtService.decodeToken(authToken);

    if (Date.now() / 1000 > Number(decoded.exp)) {
      throw new AuthTokenExpiredException();
    }
    const isValid = this.jwtService.verify(authToken);
    if (!isValid) {
      throw new InvalidAuthTokenException();
    }
    return true;
  }
}
