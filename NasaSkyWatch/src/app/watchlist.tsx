import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/theme/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedTitle } from '@/components/theme/themed-title';
import { SavedAsteroids } from '@/constants/constants';
import { AsteroidFlyby } from '@/types';
import { AsteroidCard } from '@/components/asteroid/AsteroidCard';
import { EmptyState } from '@/components/watchlist/empty-state';

export default function WatchlistScreen() {
  const isEmpty = SavedAsteroids.length === 0;
  
  const renderItem: ListRenderItem<AsteroidFlyby> = ({ item }) => (
    <AsteroidCard
      asteroid={item}
      isHazardous={item.isHazardous}
      onPress={() => {console.log('clicked')}}
    />
  )

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedTitle title="Watchlist" subtitle="Saved asteroids" />
        {isEmpty ? <EmptyState /> : (
          <FlatList<AsteroidFlyby>
            data={SavedAsteroids}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
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
  listContent: {
    paddingBottom: 100,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
});