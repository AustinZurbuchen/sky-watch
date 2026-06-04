import { AsteroidFlyby, WeekDay } from "@/types";

export const MonthAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export const Days: WeekDay[] = [
  { date: '2026-05-19', dow: 'Mon', dom: '19', hasHazard: false },
  { date: '2026-05-20', dow: 'Tue', dom: '20', hasHazard: true },
  { date: '2026-05-21', dow: 'Wed', dom: '21', hasHazard: false },
  { date: '2026-05-22', dow: 'Thu', dom: '22', hasHazard: false },
  { date: '2026-05-23', dow: 'Fri', dom: '23', hasHazard: true },
  { date: '2026-05-24', dow: 'Sat', dom: '24', hasHazard: true },
  { date: '2026-05-25', dow: 'Sun', dom: '25', hasHazard: false },
]

export const Asteroids: AsteroidFlyby[] = [
  { id: '0', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16 },
  { id: '1', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42 },
  { id: '2', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23 },
  { id: '3', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142 },
  { id: '4', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16 },
  { id: '5', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42 },
  { id: '6', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23 },
  { id: '7', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142 },
  { id: '8', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16 },
  { id: '9', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42 },
  { id: '10', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23 },
  { id: '11', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142 },
]

export const SavedAsteroids: AsteroidFlyby[] = [];