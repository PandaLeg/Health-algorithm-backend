import { Module } from '@nestjs/common';
import { doctorSpecialtyProviders } from './doctor-specialty.providers';

@Module({
  imports: [],
  providers: [...doctorSpecialtyProviders],
})
export class DoctorSpecialtyModule {}
