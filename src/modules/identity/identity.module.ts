import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { MessegerModule } from 'src/singletons/messager/messager.module';
import { RedisService } from 'src/services/redis.service';
import { MessagingService } from 'src/services/messaging.service';
import { MongoModule } from 'src/singletons/mongo/mongo.module';
import { IdentitiesService } from './identities.service';
import { identitiesProviders } from './identities.providers';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';

@Module({
  imports: [RedisModule, MessegerModule, JwtModule, MongoModule],
  providers: [
    RedisService,
    MessagingService,
    JwtService,
    IdentitiesService,
    ...identitiesProviders,
  ],
  controllers: [IdentityController],
})
export class IdentityModule {}
