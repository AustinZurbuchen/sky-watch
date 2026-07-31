import { useQuery } from '@tanstack/react-query';
import { getNearEarthObjects } from '@/api/nasa';
import { useEffect } from 'react';
import { useAsteroidStore } from '@/store/asteroidStore';
import { useSettingsStore } from '@/store/settingsStore';
import { getFeedWindow } from '@/utils/utils';

export const useAsteroids = () => {
  const daysInPast = useSettingsStore((state) => state.daysInPast);
  const setAsteroidsByDate = useAsteroidStore((state) => state.setAsteroidsByDate);

  const { startDate, endDate } = getFeedWindow(daysInPast);

  const query = useQuery({
    queryKey: ['asteroids', startDate, endDate],
    queryFn: () => getNearEarthObjects(startDate, endDate),
  });

  useEffect(() => {
    if (query.data) {
      setAsteroidsByDate(query.data);
    }
  }, [query.data]);

  return query;
};
