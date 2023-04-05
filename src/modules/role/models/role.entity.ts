import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';
import { UserRoles } from '../../user_role/models/user-roles.entity';

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
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

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
