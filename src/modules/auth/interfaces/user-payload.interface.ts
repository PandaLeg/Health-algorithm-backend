export interface UserPayload {
  id: string;
  email: string;
  phone?: string;
  roles?: Array<string>;
}
