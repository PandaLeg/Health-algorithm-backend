import { Inject, Injectable } from '@nestjs/common';
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

  async getTimeByDate(date: string): Promise<string[]> {
    const times: Appointment[] = await this.appointmentRepo.findAll({
      where: {
        date,
      },
      attributes: ['time'],
    });

    return times.map((el) => el.time);
  }
}
