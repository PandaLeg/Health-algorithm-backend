import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { RoleService } from '../../role/services/role.service';
import { PatientService } from '../../patient/services/patient.service';
import { Op } from 'sequelize';
import { RoleType } from '../../role/enums/role-type.enum';
import { Role } from '../../role/models/role.entity';
import { DoctorService } from '../../doctor/services/doctor.service';
import { SpecialtyCategory } from '../../doctor/interfaces/specialty-category.interface';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicService } from '../../clinic/services/clinic.service';
import { MultipleUserProps, UserProp } from '../../../types/user.type';
import { FileService } from '../../file/file.service';
import { BadRequestException } from '../../../exceptions/bad-request.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import { Clinic } from '../../clinic/models/clinic.entity';
import { ClinicDoctorService } from '../../clinic-doctor/services/clinic-doctor.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private userRepo: typeof User,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
    private readonly roleService: RoleService,
    private readonly fileService: FileService,
    private readonly clinicDoctorService: ClinicDoctorService,
  ) {}

  async getAll() {
    return await this.userRepo.findAll({
      include: [Role],
    });
  }

  async findById(id: string): Promise<User | null> {
    const user: User | null = await this.userRepo.findByPk(id, {
      include: [Role],
    });

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

  async findOneByMultipleFields(
    fields: MultipleUserProps[],
  ): Promise<User | null> {
    const user: User | null = await this.userRepo.findOne({
      where: {
        [Op.and]: fields,
      },
      include: [Role],
    });

    return user;
  }

  async createUser(
    userDto: CreateUserDto,
    image?: Express.Multer.File,
  ): Promise<User> {
    const user: User = this.userRepo.build({
      phone: userDto.phone,
      password: userDto.password,
      email: userDto.email,
    });

    let role: Role;

    switch (userDto.type.trim()) {
      case 'patient':
        role = await this.roleService.getRoleByValue(RoleType.PATIENT_ROLE);

        user.confirmed = true;
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

        if (image) {
          await this.writeAndSaveAvatar(image, user);
        }

        await user.save();
        await this.doctorService.createDoctor(
          doctor,
          user.id,
          specialtyCategoryDoctor,
        );

        const locations = userDto.doctor.locations;

        for (let i = 0; i < locations.length; i++) {
          const location = locations[i];

          for (let j = 0; j < location.clinicBranches.length; j++) {
            const clinicBranchId: string = location.clinicBranches[j];

            await this.clinicDoctorService.create(clinicBranchId, user.id);
          }
        }

        break;
      case 'clinic':
        const clinicExists: Clinic | null = await this.clinicService.getByName(
          userDto.clinic.name,
        );

        if (clinicExists) {
          throw new BadRequestException(
            'Clinic already exists',
            ErrorCodes.INVALID_VALIDATION,
          );
        }

        role = await this.roleService.getRoleByValue(RoleType.CLINIC_ROLE);

        if (image) {
          await this.writeAndSaveAvatar(image, user);
        }

        await user.save();
        await this.clinicService.createClinic(user.id, userDto.clinic);
        break;
    }

    await user.$set('roles', [role.id]);

    return user;
  }

  async writeAndSaveAvatar(image: Express.Multer.File, user: User) {
    const filename: string = await this.fileService.createFile(image);
    user.avatar = filename;
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
