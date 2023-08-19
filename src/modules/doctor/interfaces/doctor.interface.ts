export interface IDoctor {
  userId: string;
  firstName: string;
  lastName: string;
  surname: string;
  experience: number;
  categoryName: string;
  avatar: string | null;
  specialties: { id: number; name: string }[];
}
