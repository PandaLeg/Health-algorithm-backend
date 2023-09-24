export interface IDoctorInfoAppointment {
  id: string;
  firstName: string;
  lastName: string;
  price: number;
  specialties: { id: number; name: string }[];
}
