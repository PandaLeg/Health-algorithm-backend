import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { RoleService } from './role.service';
import { PatientService } from '../../patient/services/patient.service';
import { RoleType } from '../enums/role-type.enum';
import { Role } from '../models/role.entity';
import { DoctorService } from '../../doctor/services/doctor.service';
import { ISpecialtyCategory } from '../../doctor/interfaces/specialty-category.interface';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicService } from '../../clinic/services/clinic.service';
import { MultipleUserProps, UserProp } from '../../../base/types/user.type';
import { FileService } from '../../file/file.service';
import { BadRequestException } from '../../../base/exceptions/bad-request.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import { Clinic } from '../../clinic/models/clinic.entity';
import { ClinicDoctorService } from '../../clinic-doctor/services/clinic-doctor.service';
import { DoctorWorkPlaceDto } from '../../doctor/dto/doctor-work-place.dto';
import { DoctorScheduleService } from '../../doctor/services/doctor-schedule.service';
import { IUserRepository } from '../repos/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private userRepo: IUserRepository,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
    private readonly roleService: RoleService,
    private readonly fileService: FileService,
    private readonly clinicDoctorService: ClinicDoctorService,
    private readonly doctorScheduleService: DoctorScheduleService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userRepo.findAllWithRole();
  }

  async findById(id: string): Promise<User> {
    return await this.userRepo.findByIdWithRole(id);
  }

  async findOne(key: UserProp, value: string): Promise<User> {
    return await this.userRepo.findOneByUserProp(key, value);
  }

  async findOneByMultipleFields(fields: MultipleUserProps[]): Promise<User> {
    return await this.userRepo.findOneByUserProps(fields);
  }

  async createUser(
    userDto: CreateUserDto,
    image?: Express.Multer.File,
  ): Promise<User> {
    const user: User = this.userRepo.buildUser(userDto);

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
        const specialtyCategoryDoctor: ISpecialtyCategory =
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
          userDto.doctor,
        );

        const workPlaces: DoctorWorkPlaceDto[] =
          userDto.doctor.doctorWorkPlaces;

        for (const workPlace of workPlaces) {
          await this.clinicDoctorService.create(workPlace.id, user.id);

          for (const schedule of workPlace.schedule) {
            await this.doctorScheduleService.create(
              workPlace.id,
              user.id,
              schedule,
            );
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
    return !!(await this.userRepo.findOneByPhoneOrEmail(phone, email));
  }
}
