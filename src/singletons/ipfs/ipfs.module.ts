import { Module } from '@nestjs/common';
import { ipfsProviders } from './ipfs.providers';

@Module({
  providers: [...ipfsProviders],
  exports: [...ipfsProviders],
})
export class IpfsModule {}
