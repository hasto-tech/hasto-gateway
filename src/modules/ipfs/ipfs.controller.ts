import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RedisService } from 'src/services/redis.service';
import { IpfsService } from 'src/services/ipfs.service';
import { UploadDataToIpfsDto, RemoveDataFromIpfsDto } from './ipfs.dtos';
import { JwtService } from 'src/services/jwt.service';
import { AuthTokenGuard } from 'src/guards/authtoken.guard';

// TODO handle monitoring
@Controller('ipfs')
export class IpfsGatewayController {
  constructor(
    private readonly redisService: RedisService,
    private readonly ipfsService: IpfsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('add')
  @UseGuards(AuthTokenGuard)
  async upload(@Body() dto: UploadDataToIpfsDto) {
    try {
      const ipfsHash = await this.ipfsService.addAndPinData(dto.rawData);
      return { error: false, ipfsHash };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }

  @Post('remove')
  @UseGuards(AuthTokenGuard)
  async remove(@Body() dto: RemoveDataFromIpfsDto) {
    try {
      await this.ipfsService.unpin(dto.ipfsHash);
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
}
