import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Convenience } from './convenience.entity';
import { ClinicBranch } from './clinic-branch.entity';

@Table({ tableName: 'clinic_conveniences', createdAt: false, updatedAt: false })
export class ClinicConvenience extends Model<ClinicConvenience> {
  @ForeignKey(() => Convenience)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  convenienceId: number;

  @ForeignKey(() => ClinicBranch)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  clinicBranchId: string;
}
