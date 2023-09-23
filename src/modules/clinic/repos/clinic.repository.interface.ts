import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { IClinicInfo } from '../interfaces/clinic-info.interface';

export interface IClinicRepository extends IBaseRepository<Clinic> {
  build(userId: string, dto: CreateClinicDto): Clinic;

  findOneByName(name: string): Promise<Clinic>;

  findOneById(id: string): Promise<Clinic>;

  findAndCountAllByCity(
    city: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<Clinic>>;

  findAllByCityAndName(city: string, name: string): Promise<IClinicInfo[]>;
}
