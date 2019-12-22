import { Injectable, Scope, Inject } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { JWT_PROVIDER } from 'src/utils/constants';

@Injectable({ scope: Scope.DEFAULT })
export class JwtService {
  constructor(
    @Inject(JWT_PROVIDER)
    private readonly secret: string,
  ) {}

  async generateToken(expiresIn: number, body: any): Promise<string> {
    return jwt.sign(body, this.secret, { expiresIn });
  }

  async decodeToken(
    token: string,
  ): Promise<{ headers: any; body: any; signature: string }> {
    const decoded = jwt.decode(token);
    // TODO
    return { headers: {}, body: {}, signature: '' };
  }

  async verify(token: string): Promise<boolean> {
    // TODO
    return jwt.verify(token, this.secret) === jwt.decode(token);
  }
}
