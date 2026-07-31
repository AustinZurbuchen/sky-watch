import { useCallback, useRef } from "react"
import { router } from "expo-router";
import { View, StyleSheet, FlatList, ListRenderItem } from "react-native"
import { ThemedText } from "../theme/themedText"
import { AsteroidFlyby } from "@/types"
import { AsteroidCard } from "../asteroid/AsteroidCard";
import { useAsteroids } from "@/hooks/useAsteroids";
import { LoadingState, ErrorState } from "@/components/feedback";
import { useAsteroidStore } from "@/store/asteroidStore";
import { useSelectedDateStore } from "@/store/selectedDateStore";

const ITEM_HEIGHT = 100;
const ITEM_SEPARATOR = 10;

export const FlyBy = () => {
  const listRef = useRef<FlatList<AsteroidFlyby>>(null);
  const { isLoading, isError, refetch, isRefetching } = useAsteroids();
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);

  const asteroidsByDate = useAsteroidStore((state) => state.asteroidsByDate);
  const todaysFlybys = asteroidsByDate.find((group) => group.date === selectedDate)?.asteroids ?? [];

  const handleCardPress = useCallback((asteroid: AsteroidFlyby) => {
    router.push(`/asteroid/${asteroid.id}`);
  }, []);

  const renderItem: ListRenderItem<AsteroidFlyby> = useCallback(({ item }) => (
    <AsteroidCard
      asteroid={item}
      onPress={() => handleCardPress(item)}
    />
  ), [handleCardPress]);

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={refetch} />

  const getItemLayout = (_: ArrayLike<AsteroidFlyby> | null | undefined, index: number ) => ({
    length: ITEM_HEIGHT + ITEM_SEPARATOR,
    offset: (ITEM_HEIGHT + ITEM_SEPARATOR) * index,
    index,
  })

  return (
    <View>
      <ThemedText style={styles.title} type='subtitle' >FlyBys</ThemedText>
      <View style={styles.container}>
        <FlatList<AsteroidFlyby>
          ref={listRef}
          data={todaysFlybys}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={() => <View style={{height: ITEM_SEPARATOR}} />}
        />
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
  },
  container: {
    height: '95%',
    marginTop: 10,
  }
})