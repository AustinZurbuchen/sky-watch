import { AsteroidsByDate, WeekDay } from "@/types";
import { format } from "date-fns";

export const getDays = (asteroidsByDate: AsteroidsByDate[]) => {
  const curDate = new Date();
  const beginDate = new Date();
  beginDate.setDate(curDate.getDate() - 2);

  let days: WeekDay[] = [];
  let formattedDate = '';
  for (let i = 0; i <= 7; i++) {
    const date = new Date().setDate(beginDate.getDate() + i);
    formattedDate = format(date, 'yyyy-MM-d');
    const hasHazardous: boolean = asteroidsByDate.find(item => item.date === format(date, 'yyyy-MM-d'))?.hasHazardous || false;
    const day: WeekDay = {date: format(date, 'yyyy-MM-d'), dow: format(date, 'EEE'), dom: format(date, 'd'), hasHazard: hasHazardous}
    days.push(day);
  }
  return days;
}

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