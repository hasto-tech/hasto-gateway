import {
  Controller,
  Get,
  Post,
  Param,
  Headers,
  Body,
  UseGuards,
} from '@nestjs/common';

import { RedisService } from 'src/services/redis.service';

import EthCrypto from 'eth-crypto';
import { utils } from 'ethers';
import { randomBytes } from 'crypto';
import { JwtService } from 'src/services/jwt.service';
import { AuthTokenGuard } from 'src/guards/authtoken.guard';
import { HashcashGuard } from 'src/guards/hashcash.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('request-challange/:ethereumAddress')
  @UseGuards(HashcashGuard)
  async getAuthenticationChallange(
    @Param('ethereumAddress') ethereumAddress: string,
  ) {
    const isValidAddress = utils.isHexString(ethereumAddress);

    if (!isValidAddress) {
      return { error: true, message: 'invalid ethereum address' };
    }

    const randomness = randomBytes(7).toString('hex');

    await this.redisService.setValue(
      `${ethereumAddress}-challenge`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('face-challenge')
  @UseGuards(AuthTokenGuard)
  async faceAuthenticationChallenge(
    @Headers('signature') signature: string,
    @Body() faceAuthenticationChallangeDto: { ethereumAddress: string },
  ) {
    const randomness = await this.redisService.getValue(
      `${faceAuthenticationChallangeDto.ethereumAddress}-challenge`,
    );

    if (!randomness) {
      return {
        error: true,
        message: `challenge for ${faceAuthenticationChallangeDto.ethereumAddress} expired or not found`,
      };
    }

    try {
      const recoveredSigner = EthCrypto.recover(signature, randomness);
      const isSignatureValid =
        recoveredSigner === faceAuthenticationChallangeDto.ethereumAddress;

      if (!isSignatureValid) {
        return {
          error: true,
          message: `Invalid signature`,
        };
      }
    } catch (err) {
      return {
        error: true,
        message: `error while recovering the signature: ${err.message}`,
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
