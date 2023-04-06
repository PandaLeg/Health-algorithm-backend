import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { roleProviders } from './role.providers';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService],
})
export class RoleModule {}
