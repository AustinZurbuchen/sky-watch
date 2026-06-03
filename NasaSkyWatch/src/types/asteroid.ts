export interface AsteroidFlyby {
  id: string;
  name: string;
  missDistanceLD: number;
  isHazardous: boolean;
  closestApproachUtc: string;
  diameterMinM: number;
  diameterMaxM: number;
}

export interface WeekDay {
  date: string;
  dow: string;
  dom: string;
  hasHazard: boolean;
}

export interface AsteroidCardProps {
  asteroid: AsteroidFlyby;
  isHazardous: boolean;
}