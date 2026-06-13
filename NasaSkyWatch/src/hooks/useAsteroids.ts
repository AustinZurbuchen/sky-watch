import { useQuery } from '@tanstack/react-query';
import { getNearEarthObjects } from '@/api/nasa';
import { useEffect } from 'react';
import { useAsteroidStore } from '@/store/asteroidStore';

const getWeekDates = () => {
  const start = new Date();
  start.setDate(start.getDate() - 2);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

export const useAsteroids = () => {
  const { startDate, endDate } = getWeekDates();
  const setAsteroidsByDate = useAsteroidStore((state) => state.setAsteroidsByDate);

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
