export interface IUserPayload {
  id: string;
  email: string;
  roles: Array<string>;
  phone?: string;
}
