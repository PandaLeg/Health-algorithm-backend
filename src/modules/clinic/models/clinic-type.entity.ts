import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Clinic } from './clinic.entity';

@Table({ tableName: 'clinic_types' })
export class ClinicType extends Model<ClinicType> {
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

  @HasMany(() => Clinic)
  clinics: Clinic[];
}
