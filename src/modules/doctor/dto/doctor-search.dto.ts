import { PageDto } from '../../../base/dto/PageDto';
import { IsNotEmpty, IsString } from 'class-validator';

export class DoctorSearchDto extends PageDto {
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  readonly specialtyId: number;
  readonly doctorNameId: string;
}
