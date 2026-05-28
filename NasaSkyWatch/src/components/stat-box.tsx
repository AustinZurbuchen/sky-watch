import { ColorValue, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { useTheme } from '@/hooks/use-theme';
import { ThemeColor } from "@/constants/theme";

export type StatBoxProps = {
  label: string,
  value: number,
  color?: ThemeColor
}

export const StatBox = ({label, value, color} : StatBoxProps) => {
  const theme = useTheme();
  return (
    <ThemedView style={styles.statBox}>
      <ThemedText style={[{color: theme[color ?? 'text']}, styles.value]}>{value}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#1e2340',
    backgroundColor: '#111627',
  },
  value: {
    fontSize: 24,
    fontWeight: '500',
    // color: '#fff',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#6b7599',
  }
})