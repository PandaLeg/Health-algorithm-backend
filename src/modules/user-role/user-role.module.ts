import { Module } from '@nestjs/common';
import { userRoleProviders } from './user-role.providers';

@Module({
  providers: [...userRoleProviders],
  exports: [...userRoleProviders],
})
export class UserRoleModule {}
