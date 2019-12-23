import { Module } from '@nestjs/common';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { IpfsModule } from 'src/singletons/ipfs/ipfs.module';
import { RedisService } from 'src/services/redis.service';
import { IpfsService } from 'src/services/ipfs.service';
import { IpfsGatewayController } from './ipfs.controller';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';

@Module({
  imports: [RedisModule, IpfsModule, JwtModule],
  providers: [RedisService, IpfsService, JwtService],
  controllers: [IpfsGatewayController],
})
export class IpfsGatewayModule {}
