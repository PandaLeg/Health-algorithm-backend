import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleService } from '../../role/services/role.service';
import { PatientService } from '../../patient/services/patient.service';
import { Op } from 'sequelize';
import { RoleType } from '../../role/enums/role-type.enum';
import { Role } from '../../role/models/role.entity';
import { DoctorService } from '../../doctor/services/doctor.service';
import { SpecialtyCategory } from '../../doctor/interfaces/specialty-category.interface';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicService } from '../../clinic/services/clinic.service';
import { UserProp } from '../../../types/user.type';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private userRepo: typeof User,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
    private readonly roleService: RoleService,
  ) {}

  async getAll() {
    return await this.userRepo.findAll({
      include: [Role],
    });
  }

  async findById(id: string): Promise<User | null> {
    const user: User | null = await this.userRepo.findByPk(id);

    return user;
  }

  async findOne(key: UserProp, value: string): Promise<User | null> {
    const user: User | null = await this.userRepo.findOne({
      where: {
        [key]: value,
      },
      include: [Role],
    });

    return user;
  }

  async createUser(userDto: CreateUserDto) {
    const user: User = this.userRepo.build({
      phone: userDto.phone,
      password: userDto.password,
      email: userDto.email,
      city: userDto.city,
    });

    let role: Role;

    switch (userDto.type) {
      case 'patient':
        role = await this.roleService.getRoleByValue(RoleType.PATIENT_ROLE);

        await user.save();
        await this.patientService.createPatient(user.id, userDto.patient);
        break;
      case 'doctor':
        role = await this.roleService.getRoleByValue(RoleType.DOCTOR_ROLE);
        const doctor: Doctor = this.doctorService.buildDoctor(userDto.doctor);
        const specialtyCategoryDoctor: SpecialtyCategory =
          await this.doctorService.findSpecialtiesAndCategory(
            userDto.doctor.categoryId,
            userDto.doctor.specialties,
          );

        await user.save();
        await this.doctorService.createDoctor(
          doctor,
          user.id,
          specialtyCategoryDoctor,
        );
        break;
      case 'clinic':
        role = await this.roleService.getRoleByValue(RoleType.CLINIC_ROLE);

        await user.save();
        await this.clinicService.createClinic(user.id, userDto.clinic);
        break;
    }

    await user.$set('roles', [role.id]);
  }

  async checkUserExists(phone: string, email: string): Promise<boolean> {
    const user: User | null = await this.userRepo.findOne({
      where: {
        [Op.or]: [{ phone }, { email }],
      },
    });

    return !!user;
  }
}
