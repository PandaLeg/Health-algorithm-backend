import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { Op } from 'sequelize';
import { Convenience } from '../models/convenience.entity';

@Injectable()
export class ClinicBranchService {
  constructor(
    @Inject('CLINIC_BRANCH_REPOSITORY')
    private clinicBranchRepo: typeof ClinicBranch,
    private readonly clinicLocationService: ClinicLocationService,
  ) {}

  async getAllByLocation(locationId: string): Promise<ClinicBranch[]> {
    const branches: ClinicBranch[] = await this.clinicBranchRepo.findAll({
      where: {
        locationId,
      },
    });

    if (!branches.length) {
      throw new InternalServerErrorException();
    }

    return branches;
  }

  async getByIdWithSchedule(id: string): Promise<ClinicBranch> {
    const branch: ClinicBranch = await this.clinicBranchRepo.findByPk(id, {
      include: [
        {
          model: Convenience,
          attributes: ['id', 'name'],
        },
        {
          model: ClinicSchedule,
          attributes: ['dayType', 'from', 'to', 'weekDayId'],
        },
      ],
    });

    if (!branch) {
      throw new InternalServerErrorException();
    }

    return branch;
  }

  async getFirstByLocation(locationId: string): Promise<ClinicBranch> {
    const branch: ClinicBranch | null = await this.clinicBranchRepo.findOne({
      where: {
        locationId,
      },
    });

    if (!branch) {
      throw new InternalServerErrorException();
    }

    return branch;
  }

  async create(locationId: string, clinicId: string, address: string) {
    return await this.clinicBranchRepo.create({
      locationId,
      clinicId,
      address,
    });
  }

  async getClinicAddresses(
    clinicId: string,
    city: string,
  ): Promise<ClinicAddressInfo[]> {
    const location: ClinicLocation | null =
      await this.clinicLocationService.getByClinicIdAndCity(clinicId, city);

    const addresses: ClinicBranch[] = await this.getAllByLocation(location.id);

    return addresses.map((el): ClinicAddressInfo => {
      return {
        id: el.id,
        address: el.address,
      };
    });
  }

  async getAllByLocationWithSchedule(
    locationId: string,
    clinicBranchId: string,
    page: number,
    perPage: number,
  ) {
    const branches = await this.clinicBranchRepo.findAndCountAll({
      limit: perPage,
      offset: page,
      distinct: true,
      order: [['id', 'DESC']],
      where: {
        [Op.and]: [
          { locationId },
          {
            [Op.not]: [{ id: clinicBranchId }],
          },
        ],
      },
      include: [
        {
          model: Convenience,
          attributes: ['id', 'name'],
        },
        {
          model: ClinicSchedule,
          attributes: ['dayType', 'from', 'to', 'weekDayId'],
        },
      ],
    });

    if (!branches) {
      throw new InternalServerErrorException();
    }

    return branches;
  }
}
