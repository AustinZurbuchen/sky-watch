import { AsteroidFlyby } from "@/types";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WatchlistStore {
  savedAsteroids: AsteroidFlyby[];
  addAsteroid: (asteroid: AsteroidFlyby) => void;
  removeAsteroid: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      savedAsteroids: [],

      addAsteroid: (asteroid) => 
        set((state) => ({
          savedAsteroids: [...state.savedAsteroids, asteroid],
        })),

      removeAsteroid: (id) =>
        set((state) => ({
          savedAsteroids: state.savedAsteroids.filter((a) => a.id !== id),
        })),

      isSaved: (id) => get().savedAsteroids.some((a) => a.id === id),
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);