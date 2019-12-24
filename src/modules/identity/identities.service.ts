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

  async getByAddress(ethereumAddress: string): Promise<IdentityInterface> {
    return await this.identityModel.findOne({ ethereumAddress });
  }

  async increaseUsedTransfer(whom: string, by: number) {
    const identity = await this.getByAddress(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          usedTransfer: identity.usedTransfer + by,
        },
      },
    );
  }

  async decreaseUsedTransfer(whom: string, by: number) {
    const identity = await this.getByAddress(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          usedTransfer: identity.usedTransfer - by,
        },
      },
    );
  }

  async decreaseAvailableTransfer(whom: string, by: number) {
    const identity = await this.getByAddress(whom);
    await this.identityModel.findByIdAndUpdate(
      { ethereumAddress: whom },
      {
        $set: {
          availableTransfer: identity.availableTransfer - by,
        },
      },
    );
  }

  async increaseAvailableTransfer(whom: string, by: number) {
    const identity = await this.getByAddress(whom);
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
