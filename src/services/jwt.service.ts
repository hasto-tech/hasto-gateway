import { Injectable, Scope, Inject } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { JWT_PROVIDER } from 'src/utils/constants';

@Injectable({ scope: Scope.DEFAULT })
export class JwtService {
  constructor(
    @Inject(JWT_PROVIDER)
    private readonly secret: string,
  ) {}

  generateToken(expiresIn: number, body: any): string {
    return jwt.sign(body, this.secret, { expiresIn });
  }

  decodeToken(token: string): any {
    const decoded = jwt.decode(token);
    return decoded;
  }

  verify(token: string): boolean {
    // TODO
    return jwt.verify(token, this.secret) === jwt.decode(token);
  }
}
