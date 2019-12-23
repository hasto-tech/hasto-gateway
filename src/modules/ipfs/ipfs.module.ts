import { Module } from '@nestjs/common';
import { IpfsModule } from 'src/singletons/ipfs/ipfs.module';
import { RedisService } from 'src/services/redis.service';
import { IpfsService } from 'src/services/ipfs.service';
import { IpfsGatewayController } from './ipfs.controller';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';
import { identitiesProviders } from '../identity/identities.providers';
import { IdentitiesService } from '../identity/identities.service';
import { MongoModule } from 'dist/singletons/mongo/mongo.module';

@Module({
  imports: [IpfsModule, JwtModule, MongoModule],
  providers: [
    IpfsService,
    JwtService,
    ...identitiesProviders,
    IdentitiesService,
  ],
  controllers: [IpfsGatewayController],
})
export class IpfsGatewayModule {}
