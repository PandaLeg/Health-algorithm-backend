import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from './doctor.entity';

@Table({ tableName: 'description_doctors' })
export class DescriptionDoctor extends Model<DescriptionDoctor> {
  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  doctorId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  about: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: false,
  })
  education: string;

  @Column({
    type: DataType.TEXT,
  })
  course: string;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;
}
