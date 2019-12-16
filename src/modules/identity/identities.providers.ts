import { Connection } from 'mongoose';

import { IdentitySchema } from './identity.schema';
import { IDENTITY_SCHEMA_TOKEN, MONGO_PROVIDER } from '../../utils/constants';

export const identitiesProviders = [
  {
    provide: IDENTITY_SCHEMA_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model('Identity', IdentitySchema),
    inject: [MONGO_PROVIDER],
  },
];
