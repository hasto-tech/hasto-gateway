import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { RedisService } from 'src/services/redis.service';

import EthCrypto from 'eth-crypto';
import { utils } from 'ethers';
import { randomBytes } from 'crypto';
import { JwtService } from 'src/services/jwt.service';
import { HashcashGuard } from 'src/guards/hashcash.guard';

import { SHA256, enc } from 'crypto-js';
import { ConfigService } from 'src/services/config.service';

import { includes } from 'lodash';
import { ADMIN_ROLE_TOKEN, USER_ROLE_TOKEN } from 'src/utils/constants';
import { IsValidPublicKeyGuard } from 'src/guards/is.valid.publickey.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('request-challenge')
  @UseGuards(HashcashGuard)
  @UseGuards(IsValidPublicKeyGuard)
  async getUserAuthenticationChallenge(
    @Headers('publickey') publicKey: string,
  ) {
    // generate payload to sign
    const randomness =
      '0x' + SHA256(randomBytes(7).toString('hex')).toString(enc.Hex);

    // set role
    const role = await this.getRole(publicKey);

    await this.redisService.setValue(
      `${role}-${publicKey}-challenge`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('face-challenge')
  async faceUserAuthenticationChallenge(
    @Headers('signature') signature: string,
    @Body() dto: { publicKey: string },
  ) {
    // set role
    const role = await this.getRole(dto.publicKey);

    // Check if signature is correct
    const randomness = await this.redisService.getValue(
      `${role}-${dto.publicKey}-challenge`,
    );

    if (!randomness) {
      const message = `challenge for ${dto.publicKey} expired or not found`;
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    try {
      const isSignatureValid = await this.isSignatureValid(
        dto.publicKey,
        randomness,
        signature,
      );
      if (!isSignatureValid) {
        throw new HttpException(
          `Invalid signature`,
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    } catch (err) {
      throw new HttpException(
        `error while recovering the signature: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create an authentication token
    const authToken = await this.jwtService.generateToken(60 * 60, {
      publicKey: dto.publicKey,
      role,
    });

    return { error: false, authToken };
  }

  private async getRole(publicKey: string): Promise<'user' | 'admin'> {
    let role: 'admin' | 'user' = USER_ROLE_TOKEN;

    const ethAddress = utils.computeAddress(`0x${publicKey}`);

    const isAdmin = includes(
      this.configService.config.adminAddresses,
      ethAddress,
    );

    if (isAdmin) {
      role = ADMIN_ROLE_TOKEN;
    }

    return role;
  }

  private async isSignatureValid(
    signer: string,
    digest: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const recoveredSigner = EthCrypto.recover(signature, digest);
      return recoveredSigner === utils.computeAddress(`0x${signer}`);
    } catch (err) {
      throw err;
    }
  }
}
