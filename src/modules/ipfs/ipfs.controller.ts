import { Controller, Post, Headers, Body } from '@nestjs/common';
import { RedisService } from 'src/services/redis.service';
import { IpfsService } from 'src/services/ipfs.service';
import { UploadDataToIpfsDto, RemoveDataFromIpfsDto } from './ipfs.dtos';

@Controller('ipfs')
export class IpfsGatewayController {
  constructor(
    private readonly redisService: RedisService,
    private readonly ipfsService: IpfsService,
  ) {}

  @Post('upload')
  async upload(
    @Headers('session') session: string,
    @Body() dto: UploadDataToIpfsDto,
  ) {
    const address = await this.redisService.getValue(`session-${session}`);

    if (!address) {
      return { error: true, message: 'Invalid session' };
    }

    try {
      const ipfsHash = await this.ipfsService.addAndPinData(dto.rawData);
      return { error: false, ipfsHash };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }

  @Post('remove')
  async remove(
    @Headers('session') session: string,
    @Body() dto: RemoveDataFromIpfsDto,
  ) {
    const address = await this.redisService.getValue(`session-${session}`);

    if (!address) {
      return { error: true, message: 'Invalid session' };
    }

    try {
      await this.ipfsService.unpin(dto.ipfsHash);
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
}
