import { Module } from '@nestjs/common';
import { appealTypeProviders } from './appeal-type.providers';

@Module({
  providers: [...appealTypeProviders],
})
export class AppealTypeModule {}
