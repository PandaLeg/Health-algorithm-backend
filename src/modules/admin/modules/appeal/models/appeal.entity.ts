import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AppealType } from '../../appeal-type/models/appeal-type.entity';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'appeals' })
export class Appeal extends Model<Appeal> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @ForeignKey(() => AppealType)
  @Column({
    type: DataType.INTEGER,
  })
  typeId: number;

  @BelongsTo(() => AppealType)
  appealType: AppealType;
}
