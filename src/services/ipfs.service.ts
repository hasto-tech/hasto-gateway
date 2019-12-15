import { Injectable, Inject, Scope } from '@nestjs/common';
import { IPFS_PROVIDER } from 'src/utils/constants';

@Injectable({ scope: Scope.DEFAULT })
export class IpfsService {
  constructor(@Inject(IPFS_PROVIDER) private readonly ipfsClient: any) {}

  async addAndPinData(data: string): Promise<string> {
    const ipfsContent = await this.ipfsClient.add(data);
    const ipfsHash: string = ipfsContent[0].hash;
    await this.ipfsClient.pin.add(ipfsHash);
    return ipfsHash;
  }

  async unpin(hash: string) {
    await this.ipfsClient.pin.rm(hash);
  }
}
