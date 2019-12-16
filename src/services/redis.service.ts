import { Injectable, Scope, Inject } from '@nestjs/common';

import * as Redis from 'redis';

import { promisify } from 'util';
import { REDIS_PROVIDER } from 'src/utils/constants';

@Injectable({ scope: Scope.DEFAULT })
export class RedisService {
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redisClient: Redis.RedisClient,
  ) {}

  async setValue(key: string, value: any, ttl?: number) {
    const setValuePromise: (key: string, value: any) => unknown = promisify(
      this.redisClient.set,
    ).bind(this.redisClient);

    if (ttl) {
      const setTtlPromise: (key: string, ttl: number) => unknown = promisify(
        this.redisClient.expire,
      ).bind(this.redisClient);
      await setTtlPromise(key, ttl / 1000);
    }
    await setValuePromise(key, value);
  }

  async getValue(key: string): Promise<string> {
    const getValuePromise: (key: string) => Promise<string> = promisify(
      this.redisClient.get,
    ).bind(this.redisClient);
    return await getValuePromise(key);
  }
}
