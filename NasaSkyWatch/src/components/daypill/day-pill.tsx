import { DayPillProps } from "@/types"
import { Pressable, StyleSheet } from "react-native"
import { ThemedText } from "../theme/themed-text";
import { ThemedView } from "../theme/themed-view";

export const DayPill = ({ day, isActive, onPress }: DayPillProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, isActive && styles.pillActive]}
      >
        <ThemedText style={[styles.dow, isActive && styles.dowActive]}>{day.dow}</ThemedText>
        <ThemedText style={[styles.dom, isActive && styles.domActive]}>{day.dom}</ThemedText>
        <ThemedView style={[styles.dot, day.hasHazard ? styles.dotHazard : styles.dotDefault, isActive && !day.hasHazard && styles.dotActive]} />
      </Pressable>
  )
}

const styles = StyleSheet.create({
  pill: {
    width: 68,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#1e2340',
    backgroundColor: '#111627',
  },
  pillActive: {
    backgroundColor: '#1a2a4a',
    borderColor: '#4a9eff',
  },
  dow: {
    fontSize: 11,
    color: '#6b7599',
  },
  dowActive: {
    color: '#4a9eff',
  },
  dom: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginVertical: 4,
  },
  domActive: {
    color: '#fff',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotDefault: {
    backgroundColor: '#2a3050',
  },
  dotActive: {
    backgroundColor: '#4a9eff',
  },
  dotHazard: {
    backgroundColor: '#ff6060',
  },
});