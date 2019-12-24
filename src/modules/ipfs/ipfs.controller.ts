import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IpfsService } from 'src/services/ipfs.service';
import { UploadDataToIpfsDto, RemoveDataFromIpfsDto } from './ipfs.dtos';
import { JwtService } from 'src/services/jwt.service';
import { AuthTokenGuard } from 'src/guards/authtoken.guard';
import { IdentitiesService } from '../identity/identities.service';
import { IdentitySetGuard } from 'src/guards/idenitity.set.guard';

@Controller('ipfs')
export class IpfsGatewayController {
  constructor(
    private readonly ipfsService: IpfsService,
    private readonly jwtService: JwtService,
    private readonly identitiesService: IdentitiesService,
  ) {}

  @Post('add')
  @UseGuards(AuthTokenGuard)
  @UseGuards(IdentitySetGuard)
  async upload(
    @Headers('authtoken') authtoken: string,
    @Body() dto: UploadDataToIpfsDto,
  ) {
    const address = this.jwtService.decodeToken(authtoken).ethereumAddress;
    const byteSize = Buffer.byteLength(dto.rawData, 'utf8');
    const gbByteSize = byteSize / Math.pow(1024, 3);
    const identity = await this.identitiesService.getByAddress(address);
    const availableTransfer = identity.availableTransfer;

    if (availableTransfer < gbByteSize) {
      throw new HttpException('Transfer balance too low', HttpStatus.FORBIDDEN);
    }

    const ipfsHash = await this.ipfsService.addAndPinData(dto.rawData);
    await this.identitiesService.increaseUsedTransfer(address, gbByteSize);
    await this.identitiesService.decreaseAvailableTransfer(address, gbByteSize);
    return { error: false, ipfsHash, usedTransfer: gbByteSize };
  }

  @Post('remove')
  @UseGuards(AuthTokenGuard)
  async remove(
    @Headers('authtoken') authtoken: string,
    @Body() dto: RemoveDataFromIpfsDto,
  ) {
    // TODO monitoring
    const address = this.jwtService.decodeToken(authtoken).ethereumAddress;
    await this.ipfsService.unpin(dto.ipfsHash);
    return { error: false };
  }
}
