import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from '../../doctor/models/doctor.entity';
import { DoctorSpecialty } from '../../doctor-specialty/models/doctor-specialty.entity';

@Table({ tableName: 'specialties' })
export class Specialty extends Model<Specialty> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Doctor, () => DoctorSpecialty)
  doctors: Doctor[];
}
