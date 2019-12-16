import * as mongoose from 'mongoose';
import { MONGO_PROVIDER } from '../../utils/constants';

export const mongoProviders = [
  {
    provide: MONGO_PROVIDER,
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect(
        `mongodb://${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_NAME}`,
      );
    },
  },
];
