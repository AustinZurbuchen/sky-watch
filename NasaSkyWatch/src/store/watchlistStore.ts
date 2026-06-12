import { AsteroidFlyby } from "@/types";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.remove(key),
};

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
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);