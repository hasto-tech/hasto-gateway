import { Document } from 'mongoose';

export interface IdentityRawInterface {
  // Users master keypait public key
  readonly publicKey: string;

  /**
   * @property onContractIdentityAddress - user's real address in case of non relayed intercation, proxy address when relayed
   */
  readonly onContractIdentityAddress: string;

  // array of pinned ipfs hashes
  readonly pins?: string[];
  // array of unpinned ipfs hashes
  readonly unpins?: string[];

  // available uploads transfer in GBs
  readonly availableTransfer?: number;

  // used transfer since the begging in GBs
  readonly usedTransfer?: number;

  readonly proxyEnsName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface IdentityInterface extends IdentityRawInterface, Document {}
