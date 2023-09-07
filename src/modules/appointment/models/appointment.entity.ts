import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { Clinic } from '../../clinic/models/clinic.entity';
import { Doctor } from '../../doctor/models/doctor.entity';
import { Patient } from '../../patient/models/patient.entity';

@Table({ tableName: 'appointments' })
export class Appointment extends Model<Appointment> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ClinicBranch)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clinicBranchId: string;

  @ForeignKey(() => Clinic)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clinicId: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctorId: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  patientId: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  time: string;

  @BelongsTo(() => ClinicBranch, { onDelete: 'CASCADE' })
  clinicBranch: ClinicBranch;

  @BelongsTo(() => Clinic, { onDelete: 'CASCADE' })
  clinic: Clinic;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @BelongsTo(() => Patient, { onDelete: 'CASCADE' })
  patient: Patient;
}
