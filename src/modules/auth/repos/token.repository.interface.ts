import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { Token } from '../models/token.entity';

export interface ITokenRepository extends IBaseRepository<Token> {
  findOneByRefreshToken(refreshToken: string): Promise<Token>;

  findAllByUser(id: string): Promise<Token[]>;
}
