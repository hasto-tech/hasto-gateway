import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { IpfsGatewayModule } from './modules/ipfs/ipfs.module';

@Module({
  imports: [AuthenticationModule, IpfsGatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
