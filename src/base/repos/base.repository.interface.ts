import { Model } from 'sequelize-typescript';

export interface IBaseRepository<T extends Model> {
  create(data: T | any): Promise<T>;

  findAll(): Promise<T[]>;

  // findAll(options: FindOptions<Attributes<T>>): Promise<T[]>;

  findById(id: number | string): Promise<T>;

  remove(column: string, value: number | string): Promise<number>;
  // findById(
  //   id: number | string,
  //   options: Omit<FindOptions<Attributes<T>>, 'where'>,
  // ): Promise<T>;

  // findOne(options: FindOptions<Attributes<T>>): Promise<T>;
}
