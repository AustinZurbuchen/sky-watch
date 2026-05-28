import { WeekDay } from "./asteroid";

export interface DayPillProps {
  day: WeekDay;
  isActive: boolean;
  onPress: () => void;
}