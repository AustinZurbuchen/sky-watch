import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../theme/themedText"
import { Spacing } from "@/constants/theme"

export const EmptyState = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="bookmark-outline" size={36} color="#2a3050" />
        </View>
        <ThemedText style={styles.title}>No saved asteroids</ThemedText>
        <ThemedText style={styles.body}>
          Tap the bookmark on any asteroid to save it here for quick access.
        </ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginTop: -60,
  },
  iconWrap: {
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
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#6b7599',
    textAlign: 'center',
    lineHeight: 21,
  },
})