import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Doctor } from './doctor.entity';

@Table({ tableName: 'doctor_locations' })
export class DoctorLocation extends Model<DoctorLocation> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctorId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;
}
