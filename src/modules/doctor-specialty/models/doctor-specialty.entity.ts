import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from '../../doctor/models/doctor.entity';
import { Specialty } from '../../specialty/models/specialty.entity';

@Table({ tableName: 'doctor_specialties', createdAt: false, updatedAt: false })
export class DoctorSpecialty extends Model<DoctorSpecialty> {
  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  doctorId: string;

  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  specialtyId: number;
}
