import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicAppealDto } from '../dto/create-clinic-appeal.dto';
import { Appeal } from '../../../../appeal/models/appeal.entity';
import { UserService } from '../../../../user/services/user.service';
import { ClinicAppealService } from '../../clinic-appeal/services/clinic-appeal.service';
import { AppealTypeService } from '../../../../appeal-type/services/appeal-type.service';
import { AppealService } from '../../../../appeal/services/appeal.service';
import { AppealType } from '../../../../appeal-type/models/appeal-type.entity';
import { CreateUserDto } from '../../../../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ClinicAppeal } from '../../clinic-appeal/models/clinic-appeal.entity';

@Injectable()
export class AdminAppealService {
  constructor(
    private readonly appealService: AppealService,
    private readonly userService: UserService,
    private readonly clinicAppealService: ClinicAppealService,
    private readonly appealTypeService: AppealTypeService,
  ) {}

  async findAll() {
    return await this.appealService.findAllClinicAppeals();
  }

  async create(adminAppealDto: CreateClinicAppealDto): Promise<string> {
    const clinicExists: boolean = await this.userService.checkUserExists(
      adminAppealDto.phone,
      adminAppealDto.email,
    );
    const appealExists: boolean =
      await this.clinicAppealService.checkAppealExists(
        adminAppealDto.phone,
        adminAppealDto.email,
      );

    if (clinicExists || appealExists) {
      throw new BadRequestException('Already exists');
    }

    const appealType: AppealType = await this.appealTypeService.findTypeByName(
      adminAppealDto.type,
    );

    const appeal: Appeal = await this.appealService.create(appealType.id);

    const saltRounds = 10;
    const hashSalt: string = await bcrypt.genSalt(saltRounds);
    const hashPassword: string = await bcrypt.hash(
      adminAppealDto.password,
      hashSalt,
    );

    await this.clinicAppealService.createClinicAppeal(appeal.id, {
      ...adminAppealDto,
      password: hashPassword,
    });

    return 'Appeal created successfully';
  }

  async approveClinicAppeal(id: string): Promise<string> {
    const clinic: ClinicAppeal | null = await this.clinicAppealService.findById(
      id,
    );

    if (!clinic) {
      throw new NotFoundException('Appeal not found');
    }

    const userDto: CreateUserDto = {
      type: 'clinic',
      phone: clinic.phone,
      password: clinic.password,
      email: clinic.email,
      city: clinic.city,
      clinic: {
        name: clinic.name,
      },
    };

    await this.userService.createUser(userDto);

    await this.appealService.remove(clinic.appealId);

    return 'Appeal successfully approve';
  }

  async refuseClinicAppeal(id: string): Promise<string> {
    const clinic: ClinicAppeal | null = await this.clinicAppealService.findById(
      id,
    );

    if (!clinic) {
      throw new NotFoundException('Appeal not found');
    }

    await this.appealService.remove(clinic.appealId);

    return 'Appeal successfully refused';
  }
}
