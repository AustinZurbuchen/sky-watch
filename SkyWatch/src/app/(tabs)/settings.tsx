import { Pressable, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { ScrollView } from '@/components/ui/scrollView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/theme/themedView';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedTitle } from '@/components/theme/themedTitle';
import { SettingsSection } from '@/components/settings/settingsSection';
import { SettingsRow } from '@/components/settings/settingsRow';
import { ApiKeyInput, ChevronValue, Toggle, ValueLabel } from '@/components/settings/settingsComponents';
import { useSettingsStore } from '@/store/settingsStore';
import { scheduleTestNotification, triggerBackgroundTaskForTesting } from '@/utils/testNotifications';
import { ThemedText } from '@/components/theme/themedText';
import { useSelectedDateStore } from '@/store/selectedDateStore';

export default function SettingsScreen() {
  const {
    distanceUnit,
    daysInPast,
    hazardNotifications,
    apiKeyOverride,
    hasHydrated,
    setDistanceUnit,
    setDaysInPast,
    setHazardNotifications,
    setApiKeyOverride,
  } = useSettingsStore();
  const setSelectedDate = useSelectedDateStore((state) => state.setSelectedDate);

  const handleDaysInPastChange = () => {
    const newValue = daysInPast === 2 ? 4 : 2;
    setDaysInPast(newValue);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }
  
  if (!hasHydrated) { return null; }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedTitle title="Settings" subtitle="" />
          <SettingsSection label="Display">
            <SettingsRow 
              icon={<MaterialCommunityIcons name="ruler" size={18} color="#4a9eff" />}
              title="Distance Units"
              right={<ChevronValue value={distanceUnit} onPress={() => setDistanceUnit(distanceUnit == 'LD' ? 'km' : 'LD')}/>}
            />
            <SettingsRow
              icon={<Ionicons name="calendar-outline" size={18} color="#4a9eff" />}
              title="Days in past"
              subtitle={daysInPast === 2 ? 'Showing 2 days back' : 'Showing 4 days back'}
              right={
                <ChevronValue
                  value={`${daysInPast} days`}
                  onPress={handleDaysInPastChange}
                />
              }
            />
            <SettingsRow 
              icon={<Ionicons name="notifications-outline" size={18} color="#4a9eff" />}
              title="Hazard notifications"
              isLast
              right={<Toggle value={hazardNotifications} onToggle={() => setHazardNotifications(!hazardNotifications)} />}
            />
          </SettingsSection>
          <SettingsSection label="Advanced">
            <SettingsRow
              icon={<Ionicons name="key-outline" size={18} color="#4a9eff" />}
              title="NASA API Key"
              subtitle="Optional. Use your own key if you hit rate limits."
              isLast
              right={<ApiKeyInput value={apiKeyOverride} onChange={setApiKeyOverride} />}
            />
          </SettingsSection>
          <SettingsSection label="About">
            <SettingsRow 
              icon={<Ionicons name="information-circle-outline" size={18} color="#4a9eff" />}
              title="Version"
              right={<ValueLabel value={Constants.expoConfig?.version ?? '1.0.0'} />}
            />
            <SettingsRow 
              icon={<Ionicons name="rocket-outline" size={18} color="#4a9eff" />}
              title="Data Source"
              isLast
              right={<ValueLabel value="NASA NeoWs" />} 
            />
          </SettingsSection>
          {__DEV__ && (
            <SettingsSection label="Developer Testing">
              <SettingsRow
                icon={<Ionicons name="refresh-outline" size={18} color='#4a9eff' />}
                title="Trigger Background Task"
                isLast={false}
                right={
                  <Pressable onPress={triggerBackgroundTaskForTesting}>
                    <ThemedText style={{ color: '#4a9eff', fontSize: 13 }}>Run</ThemedText>
                  </Pressable>
                }
              />
              <SettingsRow
                icon={<Ionicons name="notifications-outline" size={18} color="#4a9eff" />}
                title="Test Notification (10s)"
                isLast
                right={
                  <Pressable onPress={scheduleTestNotification}>
                    <ThemedText style={{ color: '#4a9eff', fontSize: 13 }}>Send</ThemedText>
                  </Pressable>
                }
              />
            </SettingsSection>
          )}
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
});