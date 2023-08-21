import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ClinicLocation } from './clinic-location.entity';
import { ClinicSchedule } from './clinic-schedule.entity';
import { Clinic } from './clinic.entity';
import { ClinicConvenience } from './clinic-convenience.entity';
import { Convenience } from './convenience.entity';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicDoctor } from '../../clinic-doctor/models/clinic-doctor.entity';

@Table({ tableName: 'clinic_branches' })
export class ClinicBranch extends Model<ClinicBranch> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ClinicLocation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  locationId: string;

  @ForeignKey(() => Clinic)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clinicId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @BelongsTo(() => Clinic, { onDelete: 'CASCADE' })
  clinic: Clinic;

  @BelongsTo(() => ClinicLocation, { onDelete: 'CASCADE' })
  location: ClinicLocation;

  @HasMany(() => ClinicSchedule)
  schedules: ClinicSchedule[];

  @BelongsToMany(() => Convenience, () => ClinicConvenience)
  conveniences: Convenience[];

  @BelongsToMany(() => Doctor, () => ClinicDoctor)
  doctors: Doctor[];
}
