import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';
import { CategoryDoctor } from './category-doctor.entity';
import { DoctorSpecialty } from './doctor-specialty.entity';
import { Specialty } from './specialty.entity';
import { DescriptionDoctor } from './description-doctor.entity';

@Table({ tableName: 'doctors' })
export class Doctor extends Model<Doctor> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.DATE,
  })
  dateOfBirth: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  experience: number;

  @ForeignKey(() => CategoryDoctor)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId: number;

  @BelongsTo(() => CategoryDoctor)
  category: CategoryDoctor;

  @BelongsToMany(() => Specialty, () => DoctorSpecialty)
  specialties: Specialty[];

  @HasOne(() => DescriptionDoctor)
  description: DescriptionDoctor;
}
