import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ClinicBranch } from './clinic-branch.entity';
import { WeekDay } from '../../week-day/models/week-day.entity';

@Table({ tableName: 'clinic_schedule' })
export class ClinicSchedule extends Model<ClinicSchedule> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dayType: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
  })
  from: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
  })
  to: string;

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

  @BelongsTo(() => ClinicBranch, { onDelete: 'CASCADE' })
  clinicBranch: ClinicBranch;

  @BelongsTo(() => WeekDay)
  weekDay: WeekDay;
}
