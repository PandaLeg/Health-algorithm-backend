export interface IEntityPagination<TEntity> {
  rows: TEntity[];
  count: number;
}
