import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Patient } from '../../patient/models/patient.entity';
import { UserRole } from '../../user-role/models/user-roles.entity';
import { Role } from '../../role/models/role.entity';
import { Doctor } from '../../doctor/models/doctor.entity';
import { Clinic } from '../../clinic/models/clinic.entity';
import { Token } from '../../auth/models/token.entity';

@Table({ tableName: 'users' })
export class User extends Model<User> {
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

  @Column({
    type: DataType.STRING(100),
  })
  avatar: string;

  @Column({
    type: DataType.STRING(30),
  })
  activationCode: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActivated: boolean;

  @Column({
    type: DataType.STRING(100),
  })
  resetCode: string;

  @Column({
    type: DataType.DATE,
  })
  resetCodeExpired: string;

  @HasOne(() => Patient)
  patient: Patient;

  @HasOne(() => Doctor)
  doctor: Doctor;

  @HasOne(() => Clinic)
  clinic: Clinic;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @HasMany(() => Token)
  tokens: Token[];
}
