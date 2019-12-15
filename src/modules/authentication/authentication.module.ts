import { Module } from '@nestjs/common';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { RedisService } from 'src/services/redis.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [RedisModule],
  providers: [RedisService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
