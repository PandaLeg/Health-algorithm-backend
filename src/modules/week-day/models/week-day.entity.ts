import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ClinicSchedule } from '../../clinic/models/clinic-schedule.entity';

@Table({ tableName: 'week_days' })
export class WeekDay extends Model<WeekDay> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  name: string;

  @HasMany(() => ClinicSchedule)
  schedules: ClinicSchedule[];
}
