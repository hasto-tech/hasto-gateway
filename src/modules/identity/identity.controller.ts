import {
  Controller,
  Post,
  Headers,
  Body,
  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SetIdentityDto, ConfirmIdentityDto } from './identity.dtos';

import { randomBytes } from 'crypto';
import { RedisService } from 'src/services/redis.service';
import { MessagingService } from 'src/services/messaging.service';
import { IdentityRawInterface } from './identity.interface';
import { IdentitiesService } from './identities.service';
import { JwtService } from 'src/services/jwt.service';
import { AuthTokenGuard } from 'src/guards/authtoken.guard';
import { HashcashGuard } from 'src/guards/hashcash.guard';

// TODO migrate to jwt based authentication
@Controller('identity')
export class IdentityController {
  constructor(
    private readonly redisService: RedisService,
    private readonly messagingService: MessagingService,
    private readonly jwtService: JwtService,
    private readonly identitiesService: IdentitiesService,
  ) {}

  @Post('set')
  @UseGuards(AuthTokenGuard)
  async setCachedIdentity(
    @Headers('authtoken') authtoken: string,
    @Body() dto: SetIdentityDto,
  ) {
    // Recognize user
    const ethereumAddress = this.jwtService.decodeToken(authtoken)
      .ethereumAddress;

    // Validate payload
    if (!dto.email && !dto.phoneNumber) {
      return {
        error: true,
        message: 'Invalid payload, at least one property needs to be defined',
      };
    }

    if (dto.email && dto.phoneNumber) {
      return {
        error: true,
        message:
          'Invalid payload, email and phone number need to be set separately',
      };
    }

    // Set a confirmation code
    const confirmationCode = randomBytes(4)
      .toString('hex')
      .toUpperCase();

    // Cache declared identity
    const cacheKey = `identity-cache.${ethereumAddress}.${confirmationCode}`;

    // Send the confirmation code
    if (dto.email) {
      await this.messagingService.sendEmail(
        dto.email,
        'Hasto: Email confirmation',
        `Please confirm your identity, confirmation code: ${confirmationCode}`,
      );
      await this.redisService.setValue(
        cacheKey,
        JSON.stringify({ type: 'email', value: dto.email }),
      );
      return { error: false };
    } else if (dto.phoneNumber) {
      await this.messagingService.sendSms(
        dto.phoneNumber,
        `Please confirm your identity, confirmation code: ${confirmationCode}`,
      );
      await this.redisService.setValue(
        cacheKey,
        JSON.stringify({ type: 'phone', value: dto.phoneNumber }),
      );
      return { error: false };
    }
  }

  @Post('confirm')
  @UseGuards(AuthTokenGuard)
  async confirmCachedIdenity(
    @Headers('authtoken') authtoken: string,
    @Body() dto: ConfirmIdentityDto,
  ) {
    // Recognize user
    const ethereumAddress = this.jwtService.decodeToken(authtoken)
      .ethereumAddress;

    // Get it's identity
    const cacheKey = `identity-cache.${ethereumAddress}.${dto.confirmationCode}`;

    const cachedIdentitySetup = await this.redisService.getValue(cacheKey);

    if (!cachedIdentitySetup) {
      return { error: true, message: 'Invalid confirmation code' };
    }

    const identityInfo = JSON.parse(cachedIdentitySetup);

    // Set identity type
    let identity: IdentityRawInterface = { ethereumAddress };

    if (identityInfo.type === 'email') {
      identity.email = identityInfo.value;
    }

    if (identityInfo.type === 'phone') {
      identity.phoneNumber = identityInfo.value;
    }

    // Save identity
    try {
      await this.identitiesService.create(identity);
      return { error: false };
    } catch (err) {
      return { error: false, message: err.message };
    }
  }

  @Get('by-email/:email')
  @UseGuards(HashcashGuard)
  async getIdentityEthereumAddressByEmail(@Param('email') email: string) {
    const identity = await this.identitiesService.getByEmail(email);
    const ethereumAddress = identity.ethereumAddress;
    if (!ethereumAddress) {
      throw new HttpException(
        'User with the given email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return { error: false, ethereumAddress };
  }

  @Get('by-phone-number/:phoneNumber')
  @UseGuards(HashcashGuard)
  async getIdentityEthereumAddressByPhoneNumber(
    @Param('phoneNumber') phoneNumber: string,
  ) {
    const identity = await this.identitiesService.getByPhoneNumber(phoneNumber);
    const ethereumAddress = identity.ethereumAddress;
    if (!ethereumAddress) {
      throw new HttpException(
        'User with the given phone number does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return { error: false, ethereumAddress };
  }
}
