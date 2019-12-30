import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { IpfsGatewayModule } from './modules/ipfs/ipfs.module';
import { IdentityModule } from './modules/identity/identity.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { WorkersController } from './workers/workers.controller';

@Module({
  imports: [
    AuthenticationModule,
    IpfsGatewayModule,
    IdentityModule,
    TransfersModule,
  ],
  controllers: [WorkersController],
  providers: [],
})
export class AppModule {}
