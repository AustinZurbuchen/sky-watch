import { create } from 'zustand';

type DistanceUnit = 'LD' | 'km';
type WeekStart = 'Monday' | 'Sunday';

interface SettingsStore {
  distanceUnit: DistanceUnit;
  weekStartsOn: WeekStart;
  hazardNotifications: boolean;
  apiKeyOverride: string;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setWeekStartsOn: (day: WeekStart) => void;
  setHazardNotifications: (value: boolean) => void;
  setApiKeyOverride: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  distanceUnit: 'LD',
  weekStartsOn: 'Monday',
  hazardNotifications: true,
  apiKeyOverride: '',
  setDistanceUnit: (unit) => set({ distanceUnit: unit }),
  setWeekStartsOn: (day) => set({ weekStartsOn: day}),
  setHazardNotifications: (value) => ({ hazardNotifications: value }),
  setApiKeyOverride: (key) => set({ apiKeyOverride: key }),
}))