import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Doctor } from './doctor.entity';

@Table({ tableName: 'categories_doctor' })
export class CategoryDoctor extends Model<CategoryDoctor> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name: string;

  @HasMany(() => Doctor)
  doctors: Doctor[];
}
