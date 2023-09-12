import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { DatabaseModule } from './db/database.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { AppealModule } from './modules/admin/modules/appeal/appeal.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WeekDayModule } from './modules/week-day/week-day.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    WeekDayModule,
    AppointmentModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [AppealModule],
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
