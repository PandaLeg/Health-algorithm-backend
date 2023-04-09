import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Patient } from '../../patient/models/patient.entity';
import { UserRole } from '../../user-role/models/user-roles.entity';
import { Role } from '../../role/models/role.entity';

interface UserAttrs {
  phone: string;
  password: string;
  email: string;
  city: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserAttrs> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING(15),
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(30),
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  city: string;

  @HasOne(() => Patient)
  patient: Patient;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
