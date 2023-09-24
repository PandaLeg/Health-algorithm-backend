import { Model } from 'sequelize-typescript';

export interface IBaseRepository<T extends Model> {
  create(data: T | any): Promise<T>;

  findAll(): Promise<T[]>;

  findById(id: number | string): Promise<T>;

  remove(column: string, value: number | string): Promise<number>;
}
