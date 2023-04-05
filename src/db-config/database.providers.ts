import { Sequelize } from 'sequelize-typescript';
import * as process from 'process';
import { User } from '../modules/user/models/user.entity';
import { Patient } from '../modules/patient/models/patient.entity';

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

      sequelize.addModels([User, Patient]);
      await sequelize.sync();
      return sequelize;
    },
  },
];