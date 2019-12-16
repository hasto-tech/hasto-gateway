import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { IpfsGatewayModule } from './modules/ipfs/ipfs.module';
import { IdentityModule } from './modules/identity/identity.module';

@Module({
  imports: [AuthenticationModule, IpfsGatewayModule, IdentityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
