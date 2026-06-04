import { StyleSheet, View } from "react-native";
import { ThemedText } from "../theme/themed-text";

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

export const SettingsSection = ({ label, children }: SettingsSectionProps) => {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.card}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7599',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingBottom: 8,
    paddingTop: 12,
  },
  card: {
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    borderRadius: 16,
    overflow: 'hidden',
  },
})