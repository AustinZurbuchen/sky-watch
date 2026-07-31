import { DATE_KEY_FORMAT } from "@/constants/constants";
import { useSettingsStore } from "@/store/settingsStore";
import { AsteroidsByDate, DistanceUnit, WeekDay } from "@/types";
import { format } from "date-fns";

export const toDateKey = (date: Date) => format(date, DATE_KEY_FORMAT);

/**
 * The 8-day window the app shows: `daysInPast` behind today, then a week forward.
 * Single source of truth — `useAsteroids` requests it, the background task requests
 * it, and `getDays` builds the week strip from it. They must agree exactly or the
 * strip shows a day the feed was never asked for.
 *
 * Formats in local time deliberately. `toISOString()` would resolve to UTC, which
 * lands on a different calendar day for anyone west of Greenwich in the evening,
 * and the strip (built from local dates) would then start one day before the data.
 */
export const getFeedWindow = (daysInPast: number) => {
  const start = new Date();
  start.setDate(start.getDate() - daysInPast);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end, startDate: toDateKey(start), endDate: toDateKey(end) };
};

export const getDays = (asteroidsByDate: AsteroidsByDate[]) => {
  const { daysInPast } = useSettingsStore.getState();
  const beginDate = getFeedWindow(daysInPast).start;

  let days: WeekDay[] = [];
  for (let i = 0; i <= 7; i++) {
    const date = new Date(beginDate);
    date.setDate(beginDate.getDate() + i);
    const formattedDate = toDateKey(date);
    const asteroidData = asteroidsByDate.find(item => item.date === formattedDate);
    const hasHazardous = asteroidData?.hasHazardous ?? false;
    const day: WeekDay = {
      date: formattedDate,
      dow: format(date, 'EEE'),
      dom: format(date, 'd'),
      hasHazard: hasHazardous,
    };
    days.push(day);
  }
  return days;
}

/** One lunar distance in km — the Earth–Moon average NASA measures LD against. */
const KM_PER_LUNAR_DISTANCE = 384400;

/**
 * Renders a miss distance in the unit the user picked in Settings. Distances are
 * stored in LD (that's what the mapper rounds to), so km is derived here rather
 * than kept as a second field that could drift.
 */
export const formatDistance = (missDistanceLD: number, unit: DistanceUnit) => {
  if (unit === 'km') {
    return `${Math.round(missDistanceLD * KM_PER_LUNAR_DISTANCE).toLocaleString()} km`;
  }
  return `${missDistanceLD} LD`;
};

export const getAsteroidCount = (asteroidsByDate: AsteroidsByDate[]) => {
  let count = 0;
  for(let day of asteroidsByDate) {
    count += day.asteroids.length
  }
  return count;
}

export const getHazardousCount = (asteroidsByDate: AsteroidsByDate[]) => {
  let count = 0;
  for(let day of asteroidsByDate) {
    for(let asteroid of day.asteroids) {
      if(asteroid.isHazardous) {
        count++;
      }
    }
  }
  return count;
}

export const getTodaysCount = (today: string, asteroidsByDate: AsteroidsByDate[]) => {
  return asteroidsByDate.find(item => item.date === today)?.asteroids.length || 0;
}