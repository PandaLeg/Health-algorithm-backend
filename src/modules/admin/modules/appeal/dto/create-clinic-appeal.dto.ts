import { RequestGoal } from '../../../../../types/admin.type';

export class CreateClinicAppealDto {
  type: RequestGoal;
  phone: string;
  password: string;
  email: string;
  name: string;
  city: string;
}
