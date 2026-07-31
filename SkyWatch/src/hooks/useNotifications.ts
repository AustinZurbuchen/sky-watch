import { useEffect, useRef } from "react";
import * as Notifications from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { useAsteroidStore } from "@/store/asteroidStore";
import { useSelectedDateStore } from '@/store/selectedDateStore';
import { ASTEROID_BACKGROUND_TASK } from "@/tasks/asteroidBackgroundTask";
import {
  requestNotificationPermission,
  scheduleAsteroidNotifications,
} from '@/utils/notifications';

export const useNotifications = () => {
  const responseListner = useRef<Notifications.EventSubscription | undefined>(undefined);
  const { hazardNotifications } = useSettingsStore();
  const { asteroidsByDate } = useAsteroidStore();

  const registerbackgroundTask = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        ASTEROID_BACKGROUND_TASK
      );

      if (!isRegistered) {
        await BackgroundTask.registerTaskAsync(ASTEROID_BACKGROUND_TASK, {
          minimumInterval: 180,
        })
      }
    } catch (error) {
      console.error('Failed to register background task:', error);
    }
  };

  const unregisterBackgroundTask = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        ASTEROID_BACKGROUND_TASK
      );
      if (isRegistered) {
        await BackgroundTask.unregisterTaskAsync(ASTEROID_BACKGROUND_TASK);
      }
    } catch (error) {
      console.error('Failed to unregister background task:', error);
    }
  };

  useEffect(() => {
    if (hazardNotifications) {
      requestNotificationPermission().then((granted) => {
        if (granted && asteroidsByDate.length > 0) {
          scheduleAsteroidNotifications(asteroidsByDate);
          registerbackgroundTask();
        }
      });
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
      unregisterBackgroundTask();
    }
  }, [hazardNotifications]);

  useEffect(() => {
    if (hazardNotifications && asteroidsByDate.length > 0) {
      scheduleAsteroidNotifications(asteroidsByDate);
    }
  }, [asteroidsByDate]);
  
  useEffect(() => {
    responseListner.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const date = response.notification.request.content.data?.date;
      if (typeof date === 'string') {
        useSelectedDateStore.getState().setSelectedDate(date);
        router.push('/');
      }
    });

    return () => {
      responseListner.current?.remove();
    };
  }, []);
};