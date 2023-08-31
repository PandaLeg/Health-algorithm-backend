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
import { Appointment } from '../../appointment/models/appointment.entity';

@Table({ tableName: 'patients' })
export class Patient extends Model<Patient> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  city: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @HasMany(() => Appointment)
  appointments: Appointment[];
}
