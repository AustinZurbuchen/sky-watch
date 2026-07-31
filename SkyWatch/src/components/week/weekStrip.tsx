import { WeekDay } from "@/types";
import { useCallback, useEffect, useRef } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { DayPill } from "../daypill/dayPill";
import { getDays, toDateKey } from "@/utils/utils";
import { useAsteroidStore } from "@/store/asteroidStore";
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
    // Default to today only if nothing has chosen a date yet. A notification tap
    // sets the date and *then* navigates here, so overwriting unconditionally
    // would discard it on a cold start and land the user on the wrong day.
    const today = toDateKey(new Date());
    if (!useSelectedDateStore.getState().selectedDate) {
      setSelectedDate(today);
    }

    const index = days.findIndex((d) => d.date === useSelectedDateStore.getState().selectedDate);
    if (index !== -1) {
      listRef.current?.scrollToIndex({ index, animated: false });
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