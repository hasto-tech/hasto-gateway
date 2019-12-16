import { Controller, Post, Headers, Body } from '@nestjs/common';
import { SetIdentityDto, ConfirmIdentityDto } from './identity.dtos';

import { randomBytes } from 'crypto';
import { RedisService } from 'src/services/redis.service';
import { MessagingService } from 'src/services/messaging.service';
import { IdentityRawInterface } from './identity.interface';
import { IdentitiesService } from './identities.service';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly redisService: RedisService,
    private readonly messagingService: MessagingService,
    private readonly identitiesService: IdentitiesService,
  ) {}

  @Post('set')
  async setCachedIdentity(
    @Headers('session') session: string,
    @Body() dto: SetIdentityDto,
  ) {
    const ethereumAddress = await this.redisService.getValue(
      `session-${session}`,
    );
    if (!ethereumAddress) {
      return { error: true, message: 'Invalid session' };
    }
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

    const confirmationCode = randomBytes(4)
      .toString('hex')
      .toUpperCase();

    const cacheKey = `identity-cache.${ethereumAddress}.${confirmationCode}`;

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
  async confirmCachedIdenity(
    @Headers('session') session: string,
    @Body() dto: ConfirmIdentityDto,
  ) {
    const ethereumAddress = await this.redisService.getValue(
      `session-${session}`,
    );

    if (!ethereumAddress) {
      return { error: true, message: 'Invalid session' };
    }

    const cacheKey = `identity-cache.${ethereumAddress}.${dto.confirmationCode}`;

    const cachedIdentitySetup = await this.redisService.getValue(cacheKey);

    if (!cachedIdentitySetup) {
      return { error: true, message: 'Invalid confirmation code' };
    }

    const identityInfo = JSON.parse(cachedIdentitySetup);

    let identity: IdentityRawInterface = { ethereumAddress };

    if (identityInfo.type === 'email') {
      identity.email = identityInfo.value;
    }

    if (identityInfo.type === 'phone') {
      identity.phoneNumber = identityInfo.value;
    }
    try {
      await this.identitiesService.create(identity);
      return { error: false };
    } catch (err) {
      return { error: false, message: err.message };
    }
  }
}
