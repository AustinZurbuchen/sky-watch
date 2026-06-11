import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated/animatedIcon';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="asteroid/[id]"
          options={{
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
