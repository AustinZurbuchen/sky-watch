import { LeanrCardProps } from "@/types/learn";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../theme/themedText";

export const LearnCard = ({ badge, isWarning, title, body }: LeanrCardProps) => {
  return (
    <View style={styles.card}>
      {badge && (
        <View style={[styles.badge, isWarning && styles.badgeWarning]}>
          <ThemedText style={[styles.badgeText, isWarning && styles.badgeTextWarning]}>
            ⚠ {badge}
          </ThemedText>
        </View>
      )}
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardBody}>{body}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1a2a4a',
  },
  badgeWarning: {
    backgroundColor: '#2a0f0f',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a9eff',
  },
  badgeTextWarning: {
    color: '#ff6060',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  cardBody: {
    fontSize: 16,
    color: '#8890b0',
    lineHeight: 20,
  },
})