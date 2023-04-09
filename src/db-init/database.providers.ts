import { Sequelize } from 'sequelize-typescript';
import * as process from 'process';
import { User } from '../modules/user/models/user.entity';
import { Patient } from '../modules/patient/models/patient.entity';
import { UserRole } from '../modules/user-role/models/user-roles.entity';
import { Role } from '../modules/role/models/role.entity';
import { Doctor } from '../modules/doctor/models/doctor.entity';
import { Specialty } from '../modules/specialty/models/specialty.entity';
import { CategoryDoctor } from '../modules/category-doctor/models/category-doctor.entity';
import { DoctorSpecialty } from '../modules/doctor-specialty/models/doctor-specialty.entity';

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
        Role,
        UserRole,
        Specialty,
        DoctorSpecialty,
        CategoryDoctor,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];