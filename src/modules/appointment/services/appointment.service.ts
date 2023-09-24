import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Appointment } from '../models/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ClinicBranchService } from '../../clinic/services/clinic-branch.service';
import { DoctorService } from '../../doctor/services/doctor.service';
import { PatientService } from '../../patient/services/patient.service';
import { NotFoundException } from '../../../base/exceptions/not-found.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { Patient } from '../../patient/models/patient.entity';
import { IAppointmentPage } from '../interfaces/appointment-page.interface';
import { IAppointmentFull } from '../interfaces/appointment-full.interface';
import { IDoctorInfoAppointment } from '../interfaces/doctor-info-appointment.interface';
import { IClinicInfoAppointment } from '../interfaces/clinic-info-appointment.interface';
import { IPatientInfoAppointment } from '../interfaces/patient-info-appointment.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { IAppointmentRepository } from '../repos/appointment.repository.interface';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject('IAppointmentRepository')
    private appointmentRepo: IAppointmentRepository,
    private readonly clinicBranchService: ClinicBranchService,
    @Inject(forwardRef(() => DoctorService))
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async create(
    appointment: CreateAppointmentDto,
  ): Promise<{ message: string }> {
    const clinicBranch: ClinicBranch = await this.clinicBranchService.getById(
      appointment.clinicBranchId,
    );
    const doctor: Doctor = await this.doctorService.getById(
      appointment.doctorId,
    );
    const patient: Patient = await this.patientService.getById(
      appointment.patientId,
    );

    if (!clinicBranch || !doctor || !patient) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    await this.appointmentRepo.create({
      clinicBranchId: clinicBranch.id,
      clinicId: clinicBranch.clinicId,
      doctorId: doctor.userId,
      patientId: patient.userId,
      date: appointment.dateAppointment,
      time: appointment.time,
    });

    return {
      message: 'Appointment successfully sent',
    };
  }

  async getTimeByDate(doctorId: string, date: string): Promise<string[]> {
    const times: Appointment[] =
      await this.appointmentRepo.findAllByDoctorAndDate(doctorId, date);

    return times.map((el) => el.time);
  }

  async getAll(
    id: string,
    roles: string[],
    pageDto: PageDto,
  ): Promise<IAppointmentPage> {
    const role = roles?.find((r) => r === 'CLINIC' || r === 'PATIENT');

    if (!role) {
      throw new InternalServerErrorException();
    }

    const roleKey = role === 'CLINIC' ? 'clinicId' : 'patientId';

    const appointmentPage: IEntityPagination<Appointment> =
      await this.appointmentRepo.findAndCountAllDependingRole(
        id,
        roleKey,
        pageDto,
      );
    const appointments: IAppointmentFull[] = [];

    for (const appointmentFromDb of appointmentPage.rows) {
      const doctor: IDoctorInfoAppointment = {
        id: appointmentFromDb.doctorId,
        firstName: appointmentFromDb.doctor.firstName,
        lastName: appointmentFromDb.doctor.lastName,
        price: appointmentFromDb.doctor.price / 100,
        specialties: appointmentFromDb.doctor.specialties.map((specialty) => ({
          id: specialty.id,
          name: specialty.name,
        })),
      };

      const clinic: IClinicInfoAppointment = {
        clinicId: appointmentFromDb.clinicId,
        clinicBranchId: appointmentFromDb.clinicBranchId,
        address: appointmentFromDb.clinicBranch.address,
        city: appointmentFromDb.clinicBranch.location.city,
        name: appointmentFromDb.clinic.name,
      };

      const patient: IPatientInfoAppointment = {
        firstName: appointmentFromDb.patient.firstName,
        lastName: appointmentFromDb.patient.lastName,
        phone: appointmentFromDb.patient.user.phone,
      };

      const appointment: IAppointmentFull = {
        id: appointmentFromDb.id,
        date: appointmentFromDb.date,
        time: appointmentFromDb.time,
        doctor,
        clinicBranch: clinic,
        patient,
      };

      appointments.push(appointment);
    }

    const totalPages: number = Math.ceil(
      appointmentPage.count / pageDto.perPage,
    );

    return {
      appointments,
      totalPages,
    };
  }
}
