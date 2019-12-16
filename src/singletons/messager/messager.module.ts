import { Module } from '@nestjs/common';
import { messagerProviders } from './messager.providers';

@Module({
  providers: [...messagerProviders],
  exports: [...messagerProviders],
})
export class MessegerModule {}
