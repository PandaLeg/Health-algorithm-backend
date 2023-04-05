import { UserType } from '../../../types/user.type';
import { CreatePatientDto } from '../../patient/dto/create-patient.dto';

export class CreateUserDto {
  phone: string;
  password: string;
  email: string;
  city: string;
  type: UserType;
  patient?: CreatePatientDto;
}
