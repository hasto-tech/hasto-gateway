import { CONFIG_PROVIDER } from '../../utils/constants';
import { readFileSync } from 'fs';

export const configProviders = [
  {
    provide: CONFIG_PROVIDER,
    useFactory: async () => {
      (Object as any).Promise = global.Promise;
      const config = JSON.parse(
        readFileSync('config.json', { encoding: 'utf8' }),
      );
      return config;
    },
  },
];
