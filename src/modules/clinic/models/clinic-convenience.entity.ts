import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Convenience } from './convenience.entity';
import { Clinic } from './clinic.entity';

@Table({ tableName: 'clinic_conveniences', createdAt: false, updatedAt: false })
export class ClinicConvenience extends Model<ClinicConvenience> {
  @ForeignKey(() => Convenience)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  convenienceId: number;

  @ForeignKey(() => Clinic)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  clinicId: string;
}
