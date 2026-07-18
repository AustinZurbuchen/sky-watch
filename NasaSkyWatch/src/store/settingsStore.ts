import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DistanceUnit = 'LD' | 'km';
type DaysPast = 2 | 4;

interface SettingsStore {
  distanceUnit: DistanceUnit;
  daysInPast: DaysPast;
  hazardNotifications: boolean;
  apiKeyOverride: string;
  hasHydrated: boolean;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setDaysInPast: (day: DaysPast) => void;
  setHazardNotifications: (value: boolean) => void;
  setApiKeyOverride: (key: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      distanceUnit: 'LD',
      daysInPast: 2,
      hazardNotifications: false,
      apiKeyOverride: '',
      hasHydrated: false,
      setDistanceUnit: (unit) => set({ distanceUnit: unit }),
      setDaysInPast: (day) => set({ daysInPast: day}),
      setHazardNotifications: (value) => set({ hazardNotifications: value }),
      setApiKeyOverride: (key) => set({ apiKeyOverride: key }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)