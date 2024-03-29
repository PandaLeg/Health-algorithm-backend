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
import { ClinicType } from './clinic-type.entity';
import { ClinicBranch } from './clinic-branch.entity';
import { Appointment } from '../../appointment/models/appointment.entity';

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

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => ClinicType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clinicTypeId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @HasMany(() => ClinicBranch)
  branches: ClinicBranch[];

  @HasMany(() => ClinicLocation)
  locations: ClinicLocation[];

  @BelongsTo(() => ClinicType)
  clinicType: ClinicType;

  @HasMany(() => Appointment)
  appointments: Appointment[];
}
