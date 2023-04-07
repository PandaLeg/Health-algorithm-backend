import { Module } from '@nestjs/common';
import { specialtyProviders } from './specialty.providers';

@Module({
  imports: [],
  providers: [...specialtyProviders],
})
export class SpecialtyModule {}
