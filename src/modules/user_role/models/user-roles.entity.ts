import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';
import { Role } from '../../role/models/role.entity';

@Table({ tableName: 'user_roles', createdAt: false, updatedAt: false })
export class UserRoles extends Model<UserRoles> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  roleId: number;
}
