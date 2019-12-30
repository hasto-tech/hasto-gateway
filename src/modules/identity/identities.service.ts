import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { IDENTITY_SCHEMA_TOKEN } from 'src/utils/constants';
import { IdentityInterface, IdentityRawInterface } from './identity.interface';

@Injectable()
export class IdentitiesService {
  constructor(
    @Inject(IDENTITY_SCHEMA_TOKEN)
    private readonly identityModel: Model<IdentityInterface>,
  ) {}

  async create(identity: IdentityRawInterface): Promise<IdentityInterface> {
    try {
      return await new this.identityModel(identity).save();
    } catch (err) {
      throw err;
    }
  }

  async getByEmail(email: string): Promise<IdentityInterface> {
    return await this.identityModel.findOne({ email });
  }

  async getByPhoneNumber(phoneNumber: string): Promise<IdentityInterface> {
    return await this.identityModel.findOne({ phoneNumber });
  }

  /**
   *
   * @param publicKey - users's master keypair public key, master keypair is the one used during the final decryption beyond the proxy
   */
  async getByPublicKey(publicKey: string): Promise<IdentityInterface> {
    return await this.identityModel.findOne({ publicKey });
  }

  /**
   *
   * @param onContractIdentityAddress - user's real or proxy address if calls are relayed, in brief user's identity address
   */
  async getByOnContractIdentityAddress(
    onContractIdentityAddress: string,
  ): Promise<IdentityInterface> {
    return await this.identityModel.findOne({ onContractIdentityAddress });
  }

  /**
   *
   * @param whom - user defined by it's public key
   * @param by - how much to be increased
   */
  async increaseUsedTransfer(whom: string, by: number) {
    const identity = await this.getByPublicKey(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          usedTransfer: identity.usedTransfer + by,
        },
      },
    );
  }

  /**
   *
   * @param whom - user defined by it's public key
   * @param by - how much to be increased
   */
  async decreaseUsedTransfer(whom: string, by: number) {
    const identity = await this.getByPublicKey(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          usedTransfer: identity.usedTransfer - by,
        },
      },
    );
  }

  /**
   *
   * @param whom - user defined by it's public key
   * @param by - how much to be increased
   */
  async decreaseAvailableTransfer(whom: string, by: number) {
    const identity = await this.getByPublicKey(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          availableTransfer: identity.availableTransfer - by,
        },
      },
    );
  }

  /**
   *
   * @param whom - user defined by it's public key
   * @param by - how much to be increased
   */
  async increaseAvailableTransfer(whom: string, by: number) {
    const identity = await this.getByPublicKey(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          availableTransfer: identity.availableTransfer + by,
        },
      },
    );
  }
}
