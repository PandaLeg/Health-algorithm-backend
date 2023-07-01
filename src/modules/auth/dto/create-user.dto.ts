import { UserType } from '../../../types/user.type';
import { CreatePatientDto } from '../../patient/dto/create-patient.dto';
import { CreateDoctorDto } from '../../doctor/dto/create-doctor.dto';
import { CreateClinicDto } from '../../clinic/dto/create-clinic.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContainType } from '../validators/contain-type.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UA')
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ContainType)
  type: UserType;

  @ValidateIf((o) => !!o.patient)
  @ValidateNested()
  @Type(() => CreatePatientDto)
  patient?: CreatePatientDto;

  @ValidateIf((o) => !!o.doctor)
  @ValidateNested()
  @Type(() => CreateDoctorDto)
  doctor?: CreateDoctorDto;

  @ValidateIf((o) => !!o.clinic)
  @ValidateNested()
  @Type(() => CreateClinicDto)
  clinic?: CreateClinicDto;
}
