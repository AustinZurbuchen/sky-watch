import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'dark'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>

      <NativeTabs.Trigger name="this-week">
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
