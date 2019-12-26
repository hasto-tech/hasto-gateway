import {
  Controller,
  Get,
  Post,
  Param,
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

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('user/request-challenge/:ethereumAddress')
  @UseGuards(HashcashGuard)
  async getUserAuthenticationChallenge(
    @Param('ethereumAddress') ethereumAddress: string,
  ) {
    const isValidAddress = utils.isHexString(ethereumAddress);

    if (!isValidAddress) {
      throw new HttpException(
        'Invalid ethereum address',
        HttpStatus.BAD_REQUEST,
      );
    }

    const randomness =
      '0x' + SHA256(randomBytes(7).toString('hex')).toString(enc.Hex);

    await this.redisService.setValue(
      `user-${ethereumAddress}-challenge`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('user/face-challenge')
  async faceUserAuthenticationChallenge(
    @Headers('signature') signature: string,
    @Body() faceAuthenticationChallangeDto: { ethereumAddress: string },
  ) {
    // Check if signature is correct
    const randomness = await this.redisService.getValue(
      `user-${faceAuthenticationChallangeDto.ethereumAddress}-challenge`,
    );

    if (!randomness) {
      const message = `challenge for ${faceAuthenticationChallangeDto.ethereumAddress} expired or not found`;
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    try {
      const recoveredSigner = EthCrypto.recover(signature, randomness);
      const isSignatureValid =
        recoveredSigner === faceAuthenticationChallangeDto.ethereumAddress;

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
      ethereumAddress: faceAuthenticationChallangeDto.ethereumAddress,
      role: USER_ROLE_TOKEN,
    });

    return { error: false, authToken };
  }

  @Get('admin/request-challenge/:ethereumAddress')
  @UseGuards(HashcashGuard)
  async getAdminAuthenticationChallenge(
    @Param('ethereumAddress') ethereumAddress: string,
  ) {
    const isValidAddress = utils.isHexString(ethereumAddress);

    if (!isValidAddress) {
      throw new HttpException(
        'Invalid ethereum address',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isValidAdminAddress = includes(
      this.configService.config.adminAddresses,
      ethereumAddress,
    );

    if (!isValidAdminAddress) {
      throw new HttpException('Invalid admin address', HttpStatus.FORBIDDEN);
    }

    const randomness =
      '0x' + SHA256(randomBytes(7).toString('hex')).toString(enc.Hex);

    await this.redisService.setValue(
      `admin-${ethereumAddress}-challenge`,
      randomness,
      5000,
    );

    return { error: false, randomness };
  }

  @Post('admin/face-challenge')
  async faceAdminAuthenticationChallenge(
    @Headers('signature') signature: string,
    @Body() faceAuthenticationChallangeDto: { ethereumAddress: string },
  ) {
    // Validate caller
    const isValidAdminAddress = includes(
      this.configService.config.adminAddresses,
      faceAuthenticationChallangeDto.ethereumAddress,
    );

    if (!isValidAdminAddress) {
      throw new HttpException('Invalid admin address', HttpStatus.FORBIDDEN);
    }

    // Check if signature is correct
    const randomness = await this.redisService.getValue(
      `admin-${faceAuthenticationChallangeDto.ethereumAddress}-challenge`,
    );

    if (!randomness) {
      const message = `challenge for ${faceAuthenticationChallangeDto.ethereumAddress} expired or not found`;
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    try {
      const recoveredSigner = EthCrypto.recover(signature, randomness);
      const isSignatureValid =
        recoveredSigner === faceAuthenticationChallangeDto.ethereumAddress;

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
      ethereumAddress: faceAuthenticationChallangeDto.ethereumAddress,
      role: ADMIN_ROLE_TOKEN,
    });

    return { error: false, authToken };
  }
}
