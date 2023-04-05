import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';

@Table({ tableName: 'patients' })
export class Patient extends Model<Patient> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING(30),
  })
  firstName: string;

  @Column({
    type: DataType.STRING(30),
  })
  lastName: string;
}