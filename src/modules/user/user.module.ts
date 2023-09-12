import { forwardRef, Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './services/user.service';
import { PatientModule } from '../patient/patient.module';
import { UserController } from './controllers/user.controller';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctor/doctor.module';
import { ClinicModule } from '../clinic/clinic.module';
import { FileModule } from '../file/file.module';
import { ClinicDoctorModule } from '../clinic-doctor/clinic-doctor.module';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
    ClinicModule,
    forwardRef(() => AuthModule),
    FileModule,
    ClinicDoctorModule,
  ],
  controllers: [UserController, RoleController],
  providers: [...userProviders, UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
