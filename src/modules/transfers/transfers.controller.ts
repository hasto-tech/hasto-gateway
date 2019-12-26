import {
  Controller,
  Post,
  Get,
  UseGuards,
  Headers,
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
    const identity = await this.identitiesService.getByAddress(dto.whom);
    if (!identity) {
      throw new UserNotExistsException();
    }

    await this.identitiesService.increaseAvailableTransfer(
      dto.whom,
      dto.quantity,
    );
    return { error: false };
  }

  @Post('remove-transfer')
  @UseGuards(IsTokenValidGuard)
  @UseGuards(IsAdminGuard)
  async removeTransfer(@Body() dto: RemoveTransferDto) {
    const identity = await this.identitiesService.getByAddress(dto.whom);
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

  @Get('summary-user')
  async getTransferSummaryAsUser() {}

  @Get('summary-admin/:ethereumAddress')
  async getTransferSummaryAsAdmin() {}
}
