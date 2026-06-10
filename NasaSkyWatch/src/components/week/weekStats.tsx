import { StyleSheet, View } from "react-native";
import { StatBox } from "./statBox";

export type WeekStatsProps = {
  thisWeek: number,
  hazardous: number,
  today: number
}

export const WeekStats = ({thisWeek, hazardous, today} : WeekStatsProps) => {
  return (
    <View style={styles.statsRow}>
      <StatBox label="This Week" value={thisWeek} />
      <StatBox label="Potentially Hazardous" value={hazardous} color='hazardColor' />
      <StatBox label="Today" value={today} />
    </View>
  )
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  }
})