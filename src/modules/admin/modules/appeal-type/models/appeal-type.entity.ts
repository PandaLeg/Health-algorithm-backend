import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Appeal } from '../../appeal/models/appeal.entity';

@Table({ tableName: 'appeal_types' })
export class AppealType extends Model<AppealType> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  name: string;

  @HasMany(() => Appeal)
  appeals: Appeal[];
}
