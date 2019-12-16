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
      return await new this.identityModel(identity);
    } catch (err) {
      throw err;
    }
  }
}
