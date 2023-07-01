import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Clinic } from './clinic.entity';
import { LocationAddress } from './location-address.entity';

@Table({ tableName: 'clinic_locations' })
export class ClinicLocation extends Model<ClinicLocation> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

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
  city: string;

  @BelongsTo(() => Clinic, { onDelete: 'CASCADE' })
  clinic: Clinic;

  @HasMany(() => LocationAddress)
  addresses: LocationAddress[];
}
