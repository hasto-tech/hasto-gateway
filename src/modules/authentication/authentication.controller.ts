import { Controller, Get, Post, Param, Headers, Body } from '@nestjs/common';

import { RedisService } from 'src/services/redis.service';
import { HashcashService } from 'src/services/hashcash.service';

import EthCrypto from 'eth-crypto';
import { utils } from 'ethers';
import { randomBytes } from 'crypto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly redisService: RedisService) {}

  @Get('request-challange/:ethereumAddress')
  async getAuthenticationChallange(
    @Headers('hashcash') hashcashSolution: number,
    @Param('ethereumAddress') ethereumAddress: string,
  ) {
    if (!HashcashService.verify(4, 2, hashcashSolution)) {
      return { error: true, message: 'Invalid hashcash' };
    }
    const isValidAddress = utils.isHexString(ethereumAddress);

    if (!isValidAddress) {
      return { error: true, message: 'invalid ethereum address' };
    }

    const randomness = randomBytes(7).toString('hex');

    await this.redisService.setValue(
      `${ethereumAddress}-challange`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('face-challange')
  async faceAuthenticationChallange(
    @Headers('signature') signature: string,
    @Body() faceAuthenticationChallangeDto: { ethereumAddress: string },
  ) {
    const randomness = await this.redisService.getValue(
      `${faceAuthenticationChallangeDto.ethereumAddress}-challange`,
    );

    if (!randomness) {
      return {
        error: true,
        message: `challange for ${faceAuthenticationChallangeDto.ethereumAddress} expired or not found`,
      };
    }

    const recoveredSigner = EthCrypto.recover(signature, randomness);
    const isSignatureValid =
      recoveredSigner === faceAuthenticationChallangeDto.ethereumAddress;

    if (!isSignatureValid) {
      return {
        error: true,
        message: `Invalid signature`,
      };
    }

    const session = randomBytes(7).toString('hex');

    await this.redisService.setValue(
      `session-${session}`,
      faceAuthenticationChallangeDto.ethereumAddress,
      1000 * 60 * 30,
    );

    return { error: false, session };
  }
}
