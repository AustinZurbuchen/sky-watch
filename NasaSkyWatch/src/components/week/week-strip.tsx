import { Days } from "@/constants/constants";
import { WeekDay } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { DayPill } from "../daypill/day-pill";

const ITEM_WIDTH = 68;
const ITEM_SEPARATOR = 8;

export const WeekStrip = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-21');
  const listRef = useRef<FlatList<WeekDay>>(null);

  useEffect(() => {
    const todayIndex = Days.findIndex(d => d.date === '2026-05-21');
    if (todayIndex !== -1) {
      listRef.current?.scrollToIndex({ index: 0, animated: false});
    }
  }, []);

  const renderItem: ListRenderItem<WeekDay> = useCallback(({ item }) => (
    <DayPill
      day={item}
      isActive={item.date === selectedDate}
      onPress={() => setSelectedDate(item.date)}
    />
  ), [selectedDate]);

  const getItemLayout = (_: ArrayLike<WeekDay> | null | undefined, index: number ) => ({
    length: ITEM_WIDTH + ITEM_SEPARATOR,
    offset: (ITEM_WIDTH + ITEM_SEPARATOR) * index,
    index,
  });
  
  return (
    <FlatList<WeekDay>
      ref={listRef}
      data={Days}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.date}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={() => <View style={{ width: ITEM_SEPARATOR }} />}
    />
  )
}