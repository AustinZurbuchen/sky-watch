import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/theme/themedView';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedTitle } from '@/components/theme/themedTitle';
import { AsteroidFlyby } from '@/types';
import { AsteroidCard } from '@/components/asteroid/AsteroidCard';
import { EmptyState } from '@/components/watchlist/emptyState';
import { useWatchlistStore } from '@/store/watchlistStore';
import { useCallback, useRef } from 'react';
import { router } from 'expo-router';

const ITEM_HEIGHT = 100;
const ITEM_SEPARATOR = 10;

export default function WatchlistScreen() {
  const listRef = useRef<FlatList<AsteroidFlyby>>(null);
  const savedAsteroids = useWatchlistStore((state) => state.savedAsteroids)
  const isEmpty = savedAsteroids.length === 0;
  
  const handleCardPress = useCallback((asteroid: AsteroidFlyby) => {
    console.log(asteroid);
    console.log(savedAsteroids);
    router.push(`/asteroid/${asteroid.id}`);
  }, []);

  const renderItem: ListRenderItem<AsteroidFlyby> = ({ item }) => (
    <AsteroidCard
      asteroid={item}
      onPress={() => handleCardPress(item)}
    />
  )

  const getItemLayout = (_: ArrayLike<AsteroidFlyby> | null | undefined, index: number ) => ({
    length: ITEM_HEIGHT + ITEM_SEPARATOR,
    offset: (ITEM_HEIGHT + ITEM_SEPARATOR) * index,
    index,
  })

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedTitle title="Watchlist" subtitle="Saved asteroids" />
        <View style={styles.asteroidContainer}>
          {isEmpty ? <EmptyState /> : (
            <FlatList<AsteroidFlyby>
              ref={listRef}
              data={savedAsteroids}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              ItemSeparatorComponent={() => <View style={{ height: ITEM_SEPARATOR }} />}
            />
          )}
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
  asteroidContainer: {
    height: '93%',
    width: '100%',
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