import ipfsHttpClient = require('ipfs-http-client');
import { IPFS_PROVIDER } from '../../utils/constants';




export const ipfsProviders = [
  {
    provide: IPFS_PROVIDER,
    useFactory: async () => {
      (ipfsHttpClient as any).Promise = global.Promise;
      const ipfsProviderUrl = `http://${process.env.IPFS_HOST}:${process.env.IPFS_PORT}`;
      return new ipfsHttpClient(ipfsProviderUrl, { protocol: 'http' });
    },
  },
];
