import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from 'src/services/jwt.service';
import { IdentitiesService } from '../identity/identities.service';
import { IsAdminGuard } from 'src/guards/is.admin.guard';
import { IsTokenValidGuard } from 'src/guards/token.valid.guard';
import { AssignTransferDto, RemoveTransferDto } from './transfers.dtos';
import { UserNotExistsException } from 'src/exceptions/user.not.exists.exception';
import { IdentityRawInterface } from '../identity/identity.interface';
import { utils } from 'ethers';

@Controller('transfers')
export class TransfersControlller {
  constructor(
    private readonly jwtService: JwtService,
    private readonly identitiesService: IdentitiesService,
  ) {}

  @Post('assign-transfer')
  @UseGuards(IsTokenValidGuard)
  @UseGuards(IsAdminGuard)
  async assignTransfer(@Body() dto: AssignTransferDto) {
    const identity = await this.identitiesService.getByPublicKey(dto.whom);

    if (!identity) {
      const newAnonymousIdentity: IdentityRawInterface = {
        publicKey: dto.whom,
        onContractIdentityAddress: utils.computeAddress(`0x${dto.whom}`),
        availableTransfer: dto.quantity,
      };
      const tmp = await this.identitiesService.create(newAnonymousIdentity);
      console.log(tmp);
    } else {
      await this.identitiesService.increaseAvailableTransfer(
        dto.whom,
        dto.quantity,
      );
    }

    return { error: false };
  }

  @Post('remove-transfer')
  @UseGuards(IsTokenValidGuard)
  @UseGuards(IsAdminGuard)
  async removeTransfer(@Body() dto: RemoveTransferDto) {
    const identity = await this.identitiesService.getByPublicKey(dto.whom);
    if (!identity) {
      throw new UserNotExistsException();
    }
    const availableTransfer = identity.availableTransfer;

    if (availableTransfer < dto.quantity) {
      throw new HttpException(
        'Impossible to remove more transfer than available',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.identitiesService.decreaseAvailableTransfer(
      dto.whom,
      dto.quantity,
    );
    return { error: false };
  }

  // TODO
  @Get('summary-user')
  async getTransferSummaryAsUser() {}

  // TODO
  @Get('summary-admin/:ethereumAddress')
  async getTransferSummaryAsAdmin() {}
}
