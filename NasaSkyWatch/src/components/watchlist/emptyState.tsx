import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../theme/themedText"

export const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="bookmark-outline" size={40} color="#2a3050" />
        </View>
        <ThemedText style={styles.emptyTitle}>No saved asteroids</ThemedText>
        <ThemedText style={styles.emptyBody}>
          Tap the bookmark on any asteroid to save it here for quick access.
        </ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginTop: -60,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: '#6b7599',
    textAlign: 'center',
    lineHeight: 21,
  },
})