import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';
import { ClinicLocation } from './clinic-location.entity';
import { ClinicSchedule } from './clinic-schedule.entity';

@Table({ tableName: 'clinics' })
export class Clinic extends Model<Clinic> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @HasMany(() => ClinicLocation)
  locations: ClinicLocation[];

  @HasMany(() => ClinicSchedule)
  schedules: ClinicSchedule[];
}
