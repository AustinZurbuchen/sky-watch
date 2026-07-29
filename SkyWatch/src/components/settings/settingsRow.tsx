import { StyleSheet, View } from "react-native";
import { ThemedText } from "../theme/themedText";

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  isLast?: boolean;
}

export const SettingsRow = ({ icon, title, subtitle, right, isLast }: SettingsRowProps) => {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <ThemedText style={styles.icon}>{icon}</ThemedText>
        </View>
        <View>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {right && (
        <View style={styles.right}>
          {right}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1f30',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0f2240',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7599',
    marginTop: 2,
  },
  right: {
    marginLeft: 12,
    flexShrink: 0,
  },
})