import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AsteroidsByDate } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === Notifications.PermissionStatus.GRANTED) return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === Notifications.PermissionStatus.GRANTED;
}

export const buildNotificationContent = (
  group: AsteroidsByDate
): { title: string, body: string } => {
  const total = group.asteroids.length;
  const hazardous = group.asteroids.filter((a) => a.isHazardous).length;

  const title = "Today's Asteroid Flybys";

  const body = hazardous > 0
    ? `${total} flyby${total === 1 ? '': 's'} today | ${hazardous} potentially hazardous`
    : `${total} flyby${total === 1 ? '': 's'} today | none hazardous`;

  return { title, body };
}

export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const scheduleAsteroidNotifications = async (
  asteroidsByDate: AsteroidsByDate[]
): Promise<void> => {
  await cancelAllNotifications();

  for (const group of asteroidsByDate) {
    const { title, body } = buildNotificationContent(group);

    const [year, month, day] = group.date.split('-').map(Number);

    const notificationDate = new Date(year, month - 1, day, 9, 0, 0);
    if (notificationDate < new Date()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { date: group.date },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        year,
        month,
        day,
        hour: 9,
        minute: 0,
        second: 0,
      },
    });
  }
};

