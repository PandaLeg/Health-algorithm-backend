import { Inject, Injectable } from '@nestjs/common';
import { Convenience } from '../models/convenience.entity';
import { IConvenienceRepository } from '../repos/convenience.repository.interface';

@Injectable()
export class ConvenienceService {
  constructor(
    @Inject('IConvenienceRepository')
    private convenienceRepo: IConvenienceRepository,
  ) {}

  async getAll(): Promise<Convenience[]> {
    return await this.convenienceRepo.findAllWithAttributes();
  }
}
