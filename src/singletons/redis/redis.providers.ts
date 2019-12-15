import * as Redis from 'redis';
import { REDIS_PROVIDER } from '../../utils/constants';

export const redisProviders = [
  {
    provide: REDIS_PROVIDER,
    useFactory: async () => {
      (Redis.RedisClient as any).Promise = global.Promise;
      return new Redis.RedisClient({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      });
    },
  },
];
