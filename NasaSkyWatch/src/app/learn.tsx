import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/theme/themedView';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedTitle } from '@/components/theme/themedTitle';
import { LearnCard } from '@/components/learn/learnCard';
import { CneosLink } from '@/components/learn/link';

export default function LearnScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedTitle style={styles.title} title="Learn" subtitle="Understanding near-Earth objects" />
          <LearnCard
            badge='Potentially hazardous asteroid'
            isWarning
            title='What does "hazardous" mean?'
            body="A potentially hazardous asteroid (PHA) is on that comes within 0.05 AU (about 7.5 million km) of Earth's orbit and is larger than 140 meters in diameter. This classification does not mean an impact is imminent - it means the object warrants close monitoring by scientists."
          />
          <LearnCard
            title='Lunar Distance (LD)'
            body='Distances in Sky Watch are shown in Lunar Distances - the average gap between Earth and the Moon (384,400 km). A flyby at 1 LD is very close in astronomical terms, though still far from dangerous.'
          />
          <LearnCard
            title='How close is too close?'
            body='Objects passing within 20 LD are considered close approaches. Most cause no harm, but NASA tracks them continuously to refine orbital predictions over decades.'
          />
          <CneosLink />
        </ScrollView>
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
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    paddingBottom: 100,
  },
  title: {
    flex: 1,
  }
});