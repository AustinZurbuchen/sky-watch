import { useQuery } from '@tanstack/react-query';
import { getNearEarthObjects } from '@/api/nasa';
import { useEffect } from 'react';
import { useAsteroidStore } from '@/store/asteroidStore';
import { useSettingsStore } from '@/store/settingsStore';

const getWeekDates = (daysInPast: number) => {
  const start = new Date();
  start.setDate(start.getDate() - daysInPast);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

export const useAsteroids = () => {
  const daysInPast = useSettingsStore((state) => state.daysInPast);
  const setAsteroidsByDate = useAsteroidStore((state) => state.setAsteroidsByDate);

  const { startDate, endDate } = getWeekDates(daysInPast);

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
