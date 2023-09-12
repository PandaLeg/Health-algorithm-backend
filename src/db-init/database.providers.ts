import * as process from 'process';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../modules/user/models/user.entity';
import { Patient } from '../modules/patient/models/patient.entity';
import { UserRole } from '../modules/user/models/user-roles.entity';
import { Role } from '../modules/user/models/role.entity';
import { Doctor } from '../modules/doctor/models/doctor.entity';
import { Specialty } from '../modules/doctor/models/specialty.entity';
import { CategoryDoctor } from '../modules/doctor/models/category-doctor.entity';
import { DoctorSpecialty } from '../modules/doctor/models/doctor-specialty.entity';
import { Clinic } from '../modules/clinic/models/clinic.entity';
import { Appeal } from '../modules/appeal/models/appeal.entity';
import { AppealType } from '../modules/appeal-type/models/appeal-type.entity';
import { Token } from '../modules/auth/models/token.entity';
import { DescriptionDoctor } from '../modules/doctor/models/description-doctor.entity';
import { ClinicLocation } from '../modules/clinic/models/clinic-location.entity';
import { ClinicBranch } from '../modules/clinic/models/clinic-branch.entity';
import { ClinicDoctor } from '../modules/clinic-doctor/models/clinic-doctor.entity';
import { WeekDay } from '../modules/week-day/models/week-day.entity';
import { ClinicSchedule } from '../modules/clinic/models/clinic-schedule.entity';
import { Convenience } from '../modules/clinic/models/convenience.entity';
import { ClinicConvenience } from '../modules/clinic/models/clinic-convenience.entity';
import { ClinicType } from '../modules/clinic/models/clinic-type.entity';
import { DoctorLocation } from '../modules/doctor/models/doctor-location.entity';
import { DoctorSchedule } from '../modules/doctor/models/doctor-schedule.entity';
import { Appointment } from '../modules/appointment/models/appointment.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      });

      sequelize.addModels([
        User,
        Patient,
        Doctor,
        Clinic,
        Role,
        UserRole,
        Token,
        Specialty,
        DoctorSpecialty,
        CategoryDoctor,
        DescriptionDoctor,
        ClinicLocation,
        ClinicBranch,
        ClinicDoctor,
        ClinicSchedule,
        Convenience,
        ClinicConvenience,
        ClinicType,
        DoctorLocation,
        DoctorSchedule,
        Appeal,
        AppealType,
        WeekDay,
        Appointment,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
