import { Module } from '@nestjs/common';
import { RedisModule } from 'src/singletons/redis/redis.module';
import { RedisService } from 'src/services/redis.service';
import { AuthenticationController } from './authentication.controller';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from 'src/singletons/jwt/jwt.module';
import { ConfigModule } from 'src/singletons/config/config.module';
import { ConfigService } from 'src/services/config.service';

@Module({
  imports: [RedisModule, JwtModule, ConfigModule],
  providers: [RedisService, JwtService, ConfigService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
