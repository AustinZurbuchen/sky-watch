import { useCallback, useRef } from "react"
import { View, StyleSheet, FlatList, ListRenderItem } from "react-native"
import { ThemedText } from "../theme/themed-text"
import { AsteroidFlyby } from "@/types"
import { Asteroids } from "@/constants/constants";
import { AsteroidCard } from "../asteroid/AsteroidCard";

const ITEM_HEIGHT = 100;
const ITEM_SEPARATOR = 10;

export const FlyBy = () => {
  const listRef = useRef<FlatList<AsteroidFlyby>>(null);
  
  const renderItem: ListRenderItem<AsteroidFlyby> = useCallback(({ item }) => (
    <AsteroidCard 
      asteroid={item}
      isHazardous={item.isHazardous}
    />
  ), []);

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
          data={Asteroids}
          showsVerticalScrollIndicator={false}
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

  }
})