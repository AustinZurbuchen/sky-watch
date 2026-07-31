import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { getNearEarthObjects } from '@/api/nasa';
import { useAsteroidStore } from '@/store/asteroidStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
  scheduleAsteroidNotifications,
  requestNotificationPermission,
} from '@/utils/notifications';

export const ASTEROID_BACKGROUND_TASK = 'ASTEROID_BACKGROUND_TASK';

const getWeekDates = () => {
  const { daysInPast } = useSettingsStore.getState();
  const start = new Date();
  start.setDate(start.getDate() - daysInPast);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

TaskManager.defineTask(ASTEROID_BACKGROUND_TASK, async () => {
  try {
    // The task wakes into a fresh JS context, where `persist` rehydrates from
    // AsyncStorage asynchronously. Reading the store before that finishes yields the
    // defaults — hazardNotifications: false — and the task would return below having
    // done nothing, so notifications would never fire. Force the read to complete.
    await useSettingsStore.persist.rehydrate();

    const { hazardNotifications } = useSettingsStore.getState();

    if (!hazardNotifications) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const { startDate, endDate } = getWeekDates();
    const asteroidsByDate = await getNearEarthObjects(startDate, endDate);

    useAsteroidStore.getState().setAsteroidsByDate(asteroidsByDate);

    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      await scheduleAsteroidNotifications(asteroidsByDate)
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Background task failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});