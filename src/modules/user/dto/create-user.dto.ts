import { UserType } from '../../../types/user.type';
import { CreatePatientDto } from '../../patient/dto/create-patient.dto';
import { CreateDoctorDto } from '../../doctor/dto/create-doctor.dto';
import { CreateClinicDto } from '../../clinic/dto/create-clinic.dto';

export class CreateUserDto {
  phone: string;
  password: string;
  email: string;
  city: string;
  type: UserType;
  patient?: CreatePatientDto;
  doctor?: CreateDoctorDto;
  clinic?: CreateClinicDto;
}
