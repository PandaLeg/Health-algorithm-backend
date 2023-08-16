import { Inject, Injectable } from '@nestjs/common';
import { Convenience } from '../models/convenience.entity';

@Injectable()
export class ConvenienceService {
  constructor(
    @Inject('CONVENIENCE_REPOSITORY')
    private convenienceRepo: typeof Convenience,
  ) {}

  async getAll(): Promise<Convenience[]> {
    const conveniences: Convenience[] = await this.convenienceRepo.findAll({
      attributes: ['id', 'name'],
    });

    return conveniences;
  }
}
