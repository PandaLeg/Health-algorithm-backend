import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Appeal } from '../../../../modules/appeal/models/appeal.entity';

@Table({ tableName: 'clinic_appeals' })
export class ClinicAppeal extends Model<ClinicAppeal> {
  @ForeignKey(() => Appeal)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
  })
  appealId: string;

  @BelongsTo(() => Appeal)
  requestType: Appeal;

  @Column({
    type: DataType.STRING(15),
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(30),
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  confirmed: boolean;
}
