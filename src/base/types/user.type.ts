import { IUserAttrs } from '../../modules/user/interfaces/user-attrs.interface';

export type UserType = 'patient' | 'doctor' | 'clinic';

export type UserProp = keyof IUserAttrs;

export type MultipleUserProps = {
  [key in keyof IUserAttrs]: string;
};
