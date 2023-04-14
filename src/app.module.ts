import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { DatabaseModule } from './db-init/database.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { AdminAppealModule } from './modules/admin/modules/appeal/admin-appeal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [AdminAppealModule],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
