import { Module } from '@nestjs/common';
import { jwtProviders } from './jwt.providers';

@Module({
  providers: [...jwtProviders],
  exports: [...jwtProviders],
})
export class JwtModule {}
