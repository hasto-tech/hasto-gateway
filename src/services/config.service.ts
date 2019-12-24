import { Injectable, Scope, Inject } from '@nestjs/common';
import { CONFIG_PROVIDER } from 'src/utils/constants';

@Injectable({ scope: Scope.DEFAULT })
export class ConfigService {
  public config: {
    adminAddresses: string[];
  };
  constructor(@Inject(CONFIG_PROVIDER) config: any) {
    this.config = config;
  }
}
