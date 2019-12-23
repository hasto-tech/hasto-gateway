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
import { HashcashGuard } from 'src/guards/hashcash.guard';

import { SHA256, enc } from 'crypto-js';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('request-challenge/:ethereumAddress')
  @UseGuards(HashcashGuard)
  async getAuthenticationChallange(
    @Param('ethereumAddress') ethereumAddress: string,
  ) {
    const isValidAddress = utils.isHexString(ethereumAddress);

    if (!isValidAddress) {
      return { error: true, message: 'invalid ethereum address' };
    }

    const randomness =
      '0x' + SHA256(randomBytes(7).toString('hex')).toString(enc.Hex);

    await this.redisService.setValue(
      `${ethereumAddress}-challenge`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('face-challenge')
  async faceAuthenticationChallenge(
    @Headers('signature') signature: string,
    @Body() faceAuthenticationChallangeDto: { ethereumAddress: string },
  ) {
    // Check if signature is correct
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

    // Create an authentication token
    const authToken = await this.jwtService.generateToken(60 * 60, {
      ethereumAddress: faceAuthenticationChallangeDto.ethereumAddress,
    });

    return { error: false, authToken };
  }
}
