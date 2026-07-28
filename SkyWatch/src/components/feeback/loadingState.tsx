import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/theme/themedText';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading Asteroids... '}: LoadingStateProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a9eff" />
      <ThemedText style={styles.message}>{message}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: '#6b7599',
  },
});