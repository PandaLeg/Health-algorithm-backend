export interface IScheduleClinic {
  dayType: string;
  from: string;
  to: string;
  weekDayId: number;
  time?: string;
  weekDays?: string[];
}
