import { Module } from '@nestjs/common';
import { AdminAppealController } from './controllers/admin-appeal.controller';
import { AdminAppealService } from './services/admin-appeal.service';
import { AppealModule } from '../../../appeal/appeal.module';
import { UserModule } from '../../../user/user.module';
import { ClinicAppealModule } from '../clinic-appeal/clinic-appeal.module';
import { AppealTypeModule } from '../../../appeal-type/appeal-type.module';

@Module({
  imports: [AppealModule, UserModule, ClinicAppealModule, AppealTypeModule],
  controllers: [AdminAppealController],
  providers: [AdminAppealService],
})
export class AdminAppealModule {}
