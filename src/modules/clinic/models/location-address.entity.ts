import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ClinicLocation } from './clinic-location.entity';

@Table({ tableName: 'location_addresses' })
export class LocationAddress extends Model<LocationAddress> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @BelongsTo(() => ClinicLocation, { onDelete: 'CASCADE' })
  location: ClinicLocation;
}
