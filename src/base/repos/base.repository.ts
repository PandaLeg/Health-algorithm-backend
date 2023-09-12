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

  /*findAll(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    let entities: Promise<T[]>;

    if (options && this.isValidOptions(options)) {
      entities = this.repository.findAll({
        ...options,
      });
    } else {
      entities = this.repository.findAll();
    }

    return entities;
  }

  findById(
    id: number | string,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>,
  ): Promise<T> {
    let entity: Promise<T>;

    if (options && this.isValidOptions(options)) {
      entity = this.repository.findByPk(id, {
        ...options,
      });
    } else {
      entity = this.repository.findByPk(id);
    }

    return entity;
  }

  findOne(options: FindOptions<Attributes<T>>): Promise<T> {
    return this.repository.findOne({ ...options });
  }

  isValidOptions(include: FindOptions): include is FindOptions {
    return !!(include as FindOptions);
  }*/
}
