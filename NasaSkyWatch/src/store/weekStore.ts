import { create } from 'zustand';

interface WeekStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
}

export const useWeekStore = create<WeekStore>((set) => ({
  selectedDate: getTodayString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));