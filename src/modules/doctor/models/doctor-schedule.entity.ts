import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { WeekDay } from '../../week-day/models/week-day.entity';
import { Doctor } from './doctor.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';

@Table({ tableName: 'doctor_schedule' })
export class DoctorSchedule extends Model<DoctorSchedule> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  from: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  to: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  duration: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctorId: string;

  @ForeignKey(() => ClinicBranch)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clinicBranchId: string;

  @ForeignKey(() => WeekDay)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  weekDayId: number;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @BelongsTo(() => ClinicBranch, { onDelete: 'CASCADE' })
  clinicBranch: ClinicBranch;

  @BelongsTo(() => WeekDay)
  weekDay: WeekDay;
}
