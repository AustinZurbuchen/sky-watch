import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/theme/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MonthAbr } from '@/constants/constants';
import { ThemedTitle } from '@/components/theme/themed-title';
import { WeekStrip } from '@/components/week/week-strip';
import { WeekStats } from '@/components/week/week-stats';
import { FlyBy } from '@/components/flyby/flyby';

export default function ThisWeekScreen() {
  const getDateRange = () => {
    var curDate = new Date();
    var beginDate = new Date(); 
    var endDate = new Date();
    beginDate.setDate(curDate.getDate() - 2);
    endDate.setDate(beginDate.getDate() + 7);
    return `${MonthAbr[beginDate.getMonth()]} ${beginDate.getDate()} ${beginDate.getFullYear() === endDate.getFullYear() ? "" : beginDate.getFullYear() + " "}- ${MonthAbr[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedTitle title="Sky Watch" subtitle={getDateRange()} />
        <View style={styles.weekStrip}>
          <WeekStrip />
        </View>
        <View style={styles.weekStats}>
          <WeekStats thisWeek={14} hazardous={3} today={2}/>
        </View>
        <View style={styles.flybyContainer}>
          <FlyBy />
        </View>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  weekStrip: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '10%',
    width: '100%',
  },
  weekStats: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '10%',
    width: '100%',
  },
  flybyContainer: {
    // backgroundColor: 'blue',
    marginTop: 10,
    width: '100%',
  }
});