export interface ScheduleClinic {
  dayType: string;
  from: string;
  to: string;
  weekDayId: number;
  time?: string;
  weekDays?: string[];
}
