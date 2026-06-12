import { httpClient } from "./httpClient";
import { AsteroidsByDate, NasaApiResponse } from '@/types';
import { mapNasaResponseToAsteroidsByDate } from "./mapper";

export const getNearEarthObjects = async (startDate: string, endDate: string): Promise<AsteroidsByDate[]> => {
  const response = await httpClient.get<NasaApiResponse>('/feed', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return mapNasaResponseToAsteroidsByDate(response);
};
