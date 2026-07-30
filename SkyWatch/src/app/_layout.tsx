import '@/tasks/asteroidBackgroundTask';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatedSplashOverlay } from '@/components/animated/animatedIcon';
import { useNotifications } from '@/hooks/useNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    }
  }
});

function NotificationProvider() {
  useNotifications();
  return null;
}

export default function TabsLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="asteroid/[id]" />
        </Stack>
        <NotificationProvider />
      </ThemeProvider>
    </QueryClientProvider>
  )
}