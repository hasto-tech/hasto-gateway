import { Module } from '@nestjs/common';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { IpfsModule } from 'src/singletons/ipfs/ipfs.module';
import { RedisService } from 'src/services/redis.service';
import { IpfsService } from 'src/services/ipfs.service';
import { IpfsGatewayController } from './ipfs.controller';

@Module({
  imports: [RedisModule, IpfsModule],
  providers: [RedisService, IpfsService],
  controllers: [IpfsGatewayController],
})
export class IpfsGatewayModule {}
