import { Module } from '@nestjs/common';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { RedisService } from 'src/services/redis.service';
import { AuthenticationController } from './authentication.controller';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';

@Module({
  imports: [RedisModule, JwtModule],
  providers: [RedisService, JwtService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
