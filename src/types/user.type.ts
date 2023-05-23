import { UserAttrs } from '../modules/user/interfaces/user-attrs.interface';

export type UserType = 'patient' | 'doctor' | 'clinic';

export type UserProp = keyof UserAttrs;

export type MultipleUserProps = {
  [key in keyof UserAttrs]: string;
};
