import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleService } from '../../role/services/role.service';
import { PatientService } from '../../patient/services/patient.service';
import { Op } from 'sequelize';
import { RoleType } from '../../role/enums/role-type.enum';
import { Role } from '../../role/models/role.entity';
import { DoctorService } from '../../doctor/services/doctor.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private userRepo: typeof User,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly roleService: RoleService,
  ) {}

  async getAll() {
    return await this.userRepo.findAll({
      include: [Role],
    });
  }

  async getById(id: string) {
    const user: User | null = await this.userRepo.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {};
  }

  async createUser(userDto: CreateUserDto): Promise<string> {
    const user: User = await this.userRepo.build({
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
    }

    await user.$set('roles', [role.id]);

    return 'User created successfully';
  }

  async checkUserExists(phone: string, email: string) {
    return await this.userRepo.findOne({
      where: {
        [Op.or]: [{ phone }, { email }],
      },
    });
  }
}
