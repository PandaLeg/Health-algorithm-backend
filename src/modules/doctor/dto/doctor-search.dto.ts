import { PageDto } from '../../../dto/PageDto';
import { IsNotEmpty, IsString } from 'class-validator';

export class DoctorSearchDto extends PageDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  specialtyId: number;
  doctorNameId: string;
}
