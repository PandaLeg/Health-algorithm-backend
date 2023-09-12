export interface IDoctorInfoAppointment {
  doctorId: string;
  firstName: string;
  lastName: string;
  specialties: { id: number; name: string }[];
}
