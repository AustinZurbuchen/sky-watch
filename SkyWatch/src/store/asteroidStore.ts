import { create } from 'zustand';
import { AsteroidsByDate } from '@/types';

interface AsteroidStore {
  asteroidsByDate: AsteroidsByDate[];
  setAsteroidsByDate: (data: AsteroidsByDate[]) => void;
}

export const useAsteroidStore = create<AsteroidStore>((set) => ({
  asteroidsByDate: [],
  setAsteroidsByDate: (data) => set({ asteroidsByDate: data }),
}));