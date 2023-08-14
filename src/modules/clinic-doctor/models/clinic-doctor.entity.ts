import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';

@Table({ tableName: 'clinic_doctors' })
export class ClinicDoctor extends Model<ClinicDoctor> {
  @ForeignKey(() => ClinicBranch)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  clinicBranchId: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  doctorId: string;

  @BelongsTo(() => ClinicBranch, { onDelete: 'CASCADE' })
  clinicBranch: ClinicBranch;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;
}
