import { UserPayload } from './user-payload.interface';
import { TokenInfo } from './token-info.interface';

export interface AuthResponse {
  user: UserPayload;
  tokens: TokenInfo;
}
