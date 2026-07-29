import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../theme/themedText';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = 'Something went wrong fetching asteroud data.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="warning-outline" size={36} color="#ff6060" />
      </View>
      <ThemedText style={styles.title}>Unable to load</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="refresh-outline" size={16} color="#4a9eff" />
          <ThemedText style={styles.retryText}>Try again</ThemedText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#1f0a0a',
    borderWidth: 0.5,
    borderColor: '#5a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#6b7599',
    textAlign: 'center',
    lineHeight: 21,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    backgroundColor: '#0f2240',
    borderWidth: 0.5,
    borderColor: '#2a4a7a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a9eff',
  },
});