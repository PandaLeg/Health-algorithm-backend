import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Clinic } from '../../clinic/models/clinic.entity';
import { Doctor } from '../../doctor/models/doctor.entity';
import { LocationAddress } from '../../clinic/models/location-address.entity';

@Table({ tableName: 'clinic_doctors' })
export class ClinicDoctor extends Model<ClinicDoctor> {
  @ForeignKey(() => Clinic)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  clinicId: string;

  @ForeignKey(() => Doctor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  doctorId: string;

  @ForeignKey(() => LocationAddress)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  addressId: string;

  @BelongsTo(() => Clinic, { onDelete: 'CASCADE' })
  clinic: Clinic;

  @BelongsTo(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @BelongsTo(() => LocationAddress, { onDelete: 'CASCADE' })
  address: LocationAddress;
}
