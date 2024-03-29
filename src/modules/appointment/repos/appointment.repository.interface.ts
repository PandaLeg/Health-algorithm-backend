import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { Appointment } from '../models/appointment.entity';
import { PageDto } from '../../../base/dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

export interface IAppointmentRepository extends IBaseRepository<Appointment> {
  findAllByDoctorAndDate(
    doctorId: string,
    date: string,
  ): Promise<Appointment[]>;

  findAndCountAllDependingRole(
    id: string,
    column: 'patientId' | 'clinicId',
    pageDto: PageDto,
  ): Promise<IEntityPagination<Appointment>>;
}
