import { BaseRepository } from '../../../base/repos/base.repository';
import { Convenience } from '../models/convenience.entity';
import { IConvenienceRepository } from './convenience.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConvenienceRepository
  extends BaseRepository<Convenience>
  implements IConvenienceRepository
{
  constructor(
    @Inject('CONVENIENCE_REPOSITORY')
    private convenienceRepo: typeof Convenience,
  ) {
    super(convenienceRepo);
  }

  findAllWithAttributes(): Promise<Convenience[]> {
    return this.convenienceRepo.findAll({
      attributes: ['id', 'name'],
    });
  }
}
