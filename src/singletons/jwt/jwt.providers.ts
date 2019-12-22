import { JWT_PROVIDER } from '../../utils/constants';
import { randomBytes } from 'crypto';

export const jwtProviders = [
  {
    provide: JWT_PROVIDER,
    useFactory: async () => {
      (String as any).Promise = global.Promise;
      let jwtSecret: string;
      if (!process.env.SECRET_KEY) {
        jwtSecret = randomBytes(128).toString('hex');
      } else if (process.env.SECRET_KEY.length !== 256) {
        jwtSecret = randomBytes(128).toString('hex');
      } else {
        jwtSecret = process.env.SECRET_KEY;
      }
      return jwtSecret;
    },
  },
];
