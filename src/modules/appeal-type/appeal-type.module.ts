import { Module } from '@nestjs/common';
import { appealTypeProviders } from './appeal-type.providers';
import { AppealTypeService } from './services/appeal-type.service';

@Module({
  providers: [AppealTypeService, ...appealTypeProviders],
  exports: [AppealTypeService],
})
export class AppealTypeModule {}
