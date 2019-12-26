import { Module } from '@nestjs/common';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';
import { MongoModule } from 'dist/singletons/mongo/mongo.module';
import { IdentitiesService } from '../identity/identities.service';
import { identitiesProviders } from '../identity/identities.providers';
import { TransfersControlller } from './transfers.controller';

@Module({
  imports: [JwtModule, MongoModule],
  providers: [JwtService, IdentitiesService, ...identitiesProviders],
  controllers: [TransfersControlller],
})
export class TransfersModule {}
