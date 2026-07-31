import { AsteroidFlyby, WeekDay } from "@/types";

export const MonthAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

// The one spelling of a date key. NASA keys `near_earth_objects` with zero-padded
// dates ("2026-08-05") and mapper.ts passes those through untouched, so every
// `date` in the store is padded — and every key we build to look one up must be
// too. date-fns 'd' does NOT pad, so 'yyyy-MM-d' yields "2026-08-5", which matches
// nothing on days 1-9 of a month. Always format through this constant.
export const DATE_KEY_FORMAT = 'yyyy-MM-dd';

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
  { id: '0', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '1', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '2', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '3', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '4', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '5', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '6', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '7', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '8', name: 'test1', missDistanceLD: 4.2, isHazardous: false, closestApproachUtc: '03:42 UTC', diameterMinM: 14, diameterMaxM: 16, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '9', name: 'test2', missDistanceLD: 1.1, isHazardous: true, closestApproachUtc: '17:15 UTC', diameterMinM: 38, diameterMaxM: 42, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '10', name: 'test3', missDistanceLD: 7.8, isHazardous: false, closestApproachUtc: '18:42 UTC', diameterMinM: 20, diameterMaxM: 23, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
  { id: '11', name: 'test4', missDistanceLD: 2.3, isHazardous: true, closestApproachUtc: '21:42 UTC', diameterMinM: 140, diameterMaxM: 142, date: '5/21/2026', velocityKms: 14.3, absoluteMagnitude: 25.2, orbitClass: 'Apollo' },
]

export const SavedAsteroids: AsteroidFlyby[] = [];