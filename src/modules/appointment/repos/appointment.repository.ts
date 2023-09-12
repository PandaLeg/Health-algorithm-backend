import { BaseRepository } from '../../../db/repos/base.repository';
import { Appointment } from '../models/appointment.entity';
import { IAppointmentRepository } from './appointment.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Doctor } from '../../doctor/models/doctor.entity';
import { Specialty } from '../../doctor/models/specialty.entity';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { ClinicLocation } from '../../clinic/models/clinic-location.entity';
import { Clinic } from '../../clinic/models/clinic.entity';
import { Patient } from '../../patient/models/patient.entity';
import { User } from '../../user/models/user.entity';
import { PageDto } from '../../../base/dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

@Injectable()
export class AppointmentRepository
  extends BaseRepository<Appointment>
  implements IAppointmentRepository
{
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private appointmentRepo: typeof Appointment,
  ) {
    super(appointmentRepo);
  }

  findAllByDoctorAndDate(
    doctorId: string,
    date: string,
  ): Promise<Appointment[]> {
    return this.appointmentRepo.findAll({
      where: {
        [Op.and]: [{ date }, { doctorId }],
      },
      attributes: ['time'],
    });
  }

  findAndCountAllDependingRole(
    id: string,
    column: 'patientId' | 'clinicId',
    pageDto: PageDto,
  ): Promise<IEntityPagination<Appointment>> {
    return this.appointmentRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
      distinct: true,
      order: [
        ['date', 'DESC'],
        ['time', 'DESC'],
      ],
      where: {
        [column]: id,
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
  }
}
