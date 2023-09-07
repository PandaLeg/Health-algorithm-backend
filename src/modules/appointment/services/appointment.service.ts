import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Appointment } from '../models/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ClinicBranchService } from '../../clinic/services/clinic-branch.service';
import { DoctorService } from '../../doctor/services/doctor.service';
import { PatientService } from '../../patient/services/patient.service';
import { NotFoundException } from '../../../exceptions/not-found.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { Patient } from '../../patient/models/patient.entity';
import { Op } from 'sequelize';
import { Specialty } from '../../doctor/models/specialty.entity';
import { ClinicLocation } from '../../clinic/models/clinic-location.entity';
import { User } from '../../user/models/user.entity';
import { Clinic } from '../../clinic/models/clinic.entity';
import { AppointmentPage } from '../interfaces/appointment-page.interface';
import { AppointmentFull } from '../interfaces/appointment-full.interface';
import { DoctorInfoAppointment } from '../interfaces/doctor-info-appointment.interface';
import { ClinicInfoAppointment } from '../interfaces/clinic-info-appointment.interface';
import { PatientInfoAppointment } from '../interfaces/patient-info-appointment.interface';
import { PageDto } from '../../../dto/PageDto';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private appointmentRepo: typeof Appointment,
    private readonly clinicBranchService: ClinicBranchService,
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

  async getTimeByDate(date: string, doctorId: string): Promise<string[]> {
    const times: Appointment[] = await this.appointmentRepo.findAll({
      where: {
        [Op.and]: [{ date }, { doctorId }],
      },
      attributes: ['time'],
    });

    return times.map((el) => el.time);
  }

  async getAll(
    id: string,
    roles: string[],
    pageDto: PageDto,
  ): Promise<AppointmentPage> {
    const role = roles?.find((r) => r === 'CLINIC' || r === 'PATIENT');

    if (!role) {
      throw new InternalServerErrorException();
    }

    const roleKey = role === 'CLINIC' ? 'clinicId' : 'patientId';

    const appointmentsFromDb = await this.appointmentRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
      distinct: true,
      order: [
        ['date', 'DESC'],
        ['time', 'DESC'],
      ],
      where: {
        [roleKey]: id,
      },
      include: [
        {
          model: Doctor,
          attributes: ['firstName', 'lastName'],
          include: [{ model: Specialty, attributes: ['id', 'name'] }],
        },
        {
          model: ClinicBranch,
          attributes: ['address'],
          include: [{ model: ClinicLocation, attributes: ['city'] }],
        },
        {
          model: Clinic,
          attributes: ['name'],
        },
        {
          model: Patient,
          attributes: ['firstName', 'lastName'],
          include: [{ model: User, attributes: ['phone'] }],
        },
      ],
    });
    const appointments: AppointmentFull[] = [];

    for (const appointmentFromDb of appointmentsFromDb.rows) {
      const doctor: DoctorInfoAppointment = {
        doctorId: appointmentFromDb.doctorId,
        firstName: appointmentFromDb.doctor.firstName,
        lastName: appointmentFromDb.doctor.lastName,
        specialties: appointmentFromDb.doctor.specialties.map((specialty) => ({
          id: specialty.id,
          name: specialty.name,
        })),
      };

      const clinic: ClinicInfoAppointment = {
        clinicId: appointmentFromDb.clinicId,
        clinicBranchId: appointmentFromDb.clinicBranchId,
        address: appointmentFromDb.clinicBranch.address,
        city: appointmentFromDb.clinicBranch.location.city,
        name: appointmentFromDb.clinic.name,
      };

      const patient: PatientInfoAppointment = {
        firstName: appointmentFromDb.patient.firstName,
        lastName: appointmentFromDb.patient.lastName,
        phone: appointmentFromDb.patient.user.phone,
      };

      const appointment: AppointmentFull = {
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
      appointmentsFromDb.count / pageDto.perPage,
    );

    return {
      appointments,
      totalPages,
    };
  }
}
