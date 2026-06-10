import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/useTheme';

export default function AppTabs() {
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>

      <NativeTabs.Trigger name="thisWeek">
        <Label>This Week</Label>
        <Icon sf="calendar.circle.fill" drawable="custom_android_drawable"/>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="watchlist">
        <Label>Watchlist</Label>
        <Icon sf="bookmark.fill" drawable="custom_android_drawable"/>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learn">
        <Label>Learn</Label>
        <Icon sf="graduationcap.fill" drawable="custom_android_drawable"/>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape.fill" drawable="custom_android_drawable"/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
