import { NasaNeoEntry, NasaApiResponse, AsteroidsByDate } from "@/types";
import { AsteroidFlyby } from '@/types';

export const mapNeoEntryToAsteroidFlyby = (entry: NasaNeoEntry, date: string): AsteroidFlyby => {
  const closeApproach = entry.close_approach_data[0];
  const ORBIT_CLASS_LABELS: Record<string, string> = {
    APO: 'Apollo',
    AMO: 'Amor',
    ATE: 'Aten',
    IEO: 'Interier Earth Object',
  };

  return {
    id: entry.id,
    name: entry.name,
    isHazardous: entry.is_potentially_hazardous_asteroid,
    missDistanceLD: parseFloat(closeApproach.miss_distance.lunar),
    closestApproachUtc: closeApproach.close_approach_date_full,
    diameterMinM: Math.round(entry.estimated_diameter.meters.estimated_diameter_min),
    diameterMaxM: Math.round(entry.estimated_diameter.meters.estimated_diameter_max), 
    date,
    velocityKms: parseFloat(closeApproach.relative_velocity.kilometers_per_second),
    absoluteMagnitude: entry.absolute_magnitude_h,
    orbitClass: ORBIT_CLASS_LABELS[
      entry.orbital_data?.orbit_class?.orbit_class_type ?? ''
    ] ?? 'Unknown',
  };
};

export const mapNasaResponseToAsteroidsByDate = (response: NasaApiResponse): AsteroidsByDate[] => {
  return Object.entries(response.near_earth_objects)
    .map(([date, entries]) => {{
      const asteroids = entries
        .map((entry) => mapNeoEntryToAsteroidFlyby(entry, date))
        .sort((a, b) => a.missDistanceLD - b.missDistanceLD);

      return {
        date,
        asteroids,
        hasHazardous: asteroids.some((a) => a.isHazardous),
      };
    }})
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};