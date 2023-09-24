import { BaseRepository } from '../../../db/repos/base.repository';
import { Token } from '../models/token.entity';
import { ITokenRepository } from './token.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository
  extends BaseRepository<Token>
  implements ITokenRepository
{
  constructor(@Inject('TOKENS_REPOSITORY') private tokenRepo: typeof Token) {
    super(tokenRepo);
  }

  findAllByUser(id: string): Promise<Token[]> {
    return this.tokenRepo.findAll({
      where: {
        userId: id,
      },
    });
  }

  findOneByRefreshToken(refreshToken: string): Promise<Token> {
    return this.tokenRepo.findOne({
      where: { refreshToken },
    });
  }
}
