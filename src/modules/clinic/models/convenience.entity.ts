import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Clinic } from './clinic.entity';
import { ClinicConvenience } from './clinic-convenience.entity';

@Table({ tableName: 'conveniences' })
export class Convenience extends Model<Convenience> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Clinic, () => ClinicConvenience)
  clinics: Clinic[];
}
