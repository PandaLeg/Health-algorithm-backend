import { forwardRef, Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './services/user.service';
import { PatientModule } from '../patient/patient.module';
import { UserController } from './controllers/user.controller';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
