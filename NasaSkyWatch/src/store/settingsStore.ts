import { create } from 'zustand';

type DistanceUnit = 'LD' | 'km';
type DaysPast = 2 | 4;

interface SettingsStore {
  distanceUnit: DistanceUnit;
  daysInPast: DaysPast;
  hazardNotifications: boolean;
  apiKeyOverride: string;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setDaysInPast: (day: DaysPast) => void;
  setHazardNotifications: (value: boolean) => void;
  setApiKeyOverride: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  distanceUnit: 'LD',
  daysInPast: 2,
  hazardNotifications: true,
  apiKeyOverride: '',
  setDistanceUnit: (unit) => set({ distanceUnit: unit }),
  setDaysInPast: (day) => set({ daysInPast: day}),
  setHazardNotifications: (value) => ({ hazardNotifications: value }),
  setApiKeyOverride: (key) => set({ apiKeyOverride: key }),
}))