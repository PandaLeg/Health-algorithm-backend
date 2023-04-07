import { UserType } from '../../../types/user.type';
import { CreatePatientDto } from '../../patient/dto/create-patient.dto';
import { CreateDoctorDto } from '../../doctor/dto/create-doctor.dto';

export class CreateUserDto {
  phone: string;
  password: string;
  email: string;
  city: string;
  type: UserType;
  patient?: CreatePatientDto;
  doctor?: CreateDoctorDto;
}
