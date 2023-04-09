import { Module } from '@nestjs/common';
import { specialtyProviders } from './specialty.providers';
import { SpecialtyService } from './services/specialty.service';

@Module({
  imports: [],
  providers: [SpecialtyService, ...specialtyProviders],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
