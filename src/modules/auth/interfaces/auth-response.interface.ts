import { IUserPayload } from './user-payload.interface';
import { ITokenInfo } from './token-info.interface';

export interface IAuthResponse {
  user: IUserPayload;
  tokens: ITokenInfo;
}
