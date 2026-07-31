import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/theme/themedView';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MonthAbr } from '@/constants/constants';
import { ThemedTitle } from '@/components/theme/themedTitle';
import { WeekStrip } from '@/components/week/weekStrip';
import { WeekStats } from '@/components/week/weekStats';
import { FlyBy } from '@/components/flyby/flyby';
import { getAsteroidCount, getHazardousCount, getTodaysCount, toDateKey } from '@/utils/utils';
import { useAsteroidStore } from '@/store/asteroidStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function IndexScreen() {
  const asteroidsByDate = useAsteroidStore((state) => state.asteroidsByDate);
  const daysInPast = useSettingsStore((state) => state.daysInPast);
  const getDateRange = () => {
    const curDate = new Date();
    const beginDate = new Date(); 
    const endDate = new Date();
    beginDate.setDate(curDate.getDate() - daysInPast);
    endDate.setDate(beginDate.getDate() + 7);
    return `${MonthAbr[beginDate.getMonth()]} ${beginDate.getDate()} ${beginDate.getFullYear() === endDate.getFullYear() ? "" : beginDate.getFullYear() + " "}- ${MonthAbr[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedTitle title="SkyWatchNEO" subtitle={getDateRange()} />
        <View style={styles.weekStrip}>
          <WeekStrip />
        </View>
        <View style={styles.weekStats}>
          <WeekStats thisWeek={getAsteroidCount(asteroidsByDate)} hazardous={getHazardousCount(asteroidsByDate)} today={getTodaysCount(toDateKey(new Date()), asteroidsByDate)}/>
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
    height: '65%',
    marginTop: 10,
    width: '100%',
  }
});