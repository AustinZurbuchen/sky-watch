import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';

export const triggerBackgroundTaskForTesting = async () => {
  try {
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
  } catch (error) {
    console.log('Error with background task');
  }
}

export const scheduleTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test - Today's Flybys",
      body: '3 flybys today | 1 potentially hazardous',
      data: { date: new Date().toISOString().split('T')[0] },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
    },
  });
  console.log('Test notification fires in 10 seconds');
}