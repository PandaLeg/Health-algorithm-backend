import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { Doctor } from '../models/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { IDoctorName } from '../interfaces/doctor-name.interface';
import { LastNameDto } from '../dto/last-name.dto';
import { IDoctor } from '../interfaces/doctor.interface';
import { DoctorSearchDto } from '../dto/doctor-search.dto';

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  build(dto: CreateDoctorDto): Doctor;

  findAndCountAll(pageDto: PageDto): Promise<IEntityPagination<Doctor>>;

  findOneByIdWithRelations(doctorId: string): Promise<Doctor>;

  findAndCountAllByBranch(
    id: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<Doctor>>;

  findNamesByCityAndLastName(lastNameDto: LastNameDto): Promise<IDoctorName[]>;

  findAndCountAllBySearchParams(
    pageDto: PageDto,
    searchDto: DoctorSearchDto,
  ): Promise<IEntityPagination<IDoctor>>;
}
