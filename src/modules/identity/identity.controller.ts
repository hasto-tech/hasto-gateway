import { Controller, Post } from '@nestjs/common';

@Controller('identity')
export class IdentityController {
  constructor() {}

  @Post('set')
  async setCachedIdentity() {}

  @Post('confirm')
  async confirmCachedIdenity() {}
}
