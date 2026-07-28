export interface AsteroidFlyby {
  id: string;
  name: string;
  missDistanceLD: number;
  isHazardous: boolean;
  closestApproachUtc: string;
  diameterMinM: number;
  diameterMaxM: number;
  date: string;
  velocityKms: number;
  absoluteMagnitude: number;
  orbitClass: string;
}

export interface AsteroidsByDate {
  date: string;
  asteroids: AsteroidFlyby[];
  hasHazardous: boolean;
}

export interface WeekDay {
  date: string;
  dow: string;
  dom: string;
  hasHazard: boolean;
}

export interface AsteroidCardProps {
  asteroid: AsteroidFlyby;
  onPress?: () => void;
}