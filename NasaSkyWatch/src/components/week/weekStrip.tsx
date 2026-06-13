import { WeekDay } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { DayPill } from "../daypill/dayPill";
import { useAsteroids } from "@/hooks/useAsteroids";
import { getDays } from "@/utils/utils";
import { useAsteroidStore } from "@/store/asteroidStore";
import { format } from "date-fns";
import { useSelectedDateStore } from "@/store/selectedDateStore";

const ITEM_WIDTH = 68;
const ITEM_SEPARATOR = 8;

export const WeekStrip = () => {
  const asteroidsByDate = useAsteroidStore((state) => state.asteroidsByDate);
  const listRef = useRef<FlatList<WeekDay>>(null);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const setSelectedDate = useSelectedDateStore((state) => state.setSelectedDate);
  const days = getDays(asteroidsByDate);

  useEffect(() => {
    setSelectedDate(format(new Date, 'yyyy-MM-d'));
    const todayIndex = days.findIndex(d => d.date === format(new Date, 'yyyy-MM-d'));
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
      data={days}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.date}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={() => <View style={{ width: ITEM_SEPARATOR }} />}
    />
  )
}