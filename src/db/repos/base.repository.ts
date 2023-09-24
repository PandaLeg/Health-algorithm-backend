import { IBaseRepository } from './base.repository.interface';
import { Model, ModelCtor } from 'sequelize-typescript';

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  private repository: ModelCtor<T>;

  protected constructor(repository: ModelCtor<T>) {
    this.repository = repository;
  }

  create(data: T | any): Promise<T> {
    return this.repository.create(data);
  }

  findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  findById(id: number | string): Promise<T> {
    return this.repository.findByPk(id);
  }

  remove(column: string, value: number | string): Promise<number> {
    const where = {};
    where[column] = value;

    return this.repository.destroy({
      where,
    });
  }
}
