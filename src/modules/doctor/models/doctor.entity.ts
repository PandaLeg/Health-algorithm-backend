import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.entity';
import { CategoryDoctor } from './category-doctor.entity';
import { DoctorSpecialty } from './doctor-specialty.entity';
import { Specialty } from './specialty.entity';
import { DescriptionDoctor } from './description-doctor.entity';
import { DoctorLocation } from './doctor-location.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { ClinicDoctor } from '../../clinic-doctor/models/clinic-doctor.entity';
import { DoctorSchedule } from './doctor-schedule.entity';

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

  @HasMany(() => DoctorSpecialty)
  doctorSpecialties: DoctorSpecialty[];

  @BelongsToMany(() => ClinicBranch, () => ClinicDoctor)
  clinicBranches: ClinicBranch[];

  @HasOne(() => DescriptionDoctor)
  description: DescriptionDoctor;

  @HasMany(() => DoctorLocation)
  locations: DoctorLocation[];

  @HasMany(() => DoctorSchedule)
  schedules: DoctorSchedule[];
}
