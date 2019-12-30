import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IdentitiesService } from 'src/modules/identity/identities.service';
import { JwtService } from 'src/services/jwt.service';
import { EmptyIdentityException } from 'src/exceptions/empty.identity.exception';

@Injectable()
export class IdentitySetGuard implements CanActivate {
  constructor(
    private readonly identitiesService: IdentitiesService,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken: string = request.headers.authtoken;
    const decoded = this.jwtService.decodeToken(authToken);

    return this.identitiesService
      .getByPublicKey(decoded.publicKey)
      .then(identity => {
        if (identity) {
          return true;
        }
        return false;
      });
  }
}
