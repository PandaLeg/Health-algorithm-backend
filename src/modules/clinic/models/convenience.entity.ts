import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClinicConvenience } from './clinic-convenience.entity';
import { ClinicBranch } from './clinic-branch.entity';

@Table({ tableName: 'conveniences' })
export class Convenience extends Model<Convenience> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => ClinicBranch, () => ClinicConvenience)
  clinics: ClinicBranch[];
}
