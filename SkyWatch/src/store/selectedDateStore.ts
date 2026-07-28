import { create } from "zustand";

interface SelectedDateStore {
  selectedDate: string;
  setSelectedDate: (data: string) => void;
}

export const useSelectedDateStore = create<SelectedDateStore>((set) => ({
  selectedDate: '',
  setSelectedDate: (data) => set({ selectedDate: data}),
}));