import { Module } from '@nestjs/common';
import { AppealModule } from './modules/appeal/appeal.module';

@Module({
  imports: [AppealModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
