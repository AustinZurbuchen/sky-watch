import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/theme/themedView';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedTitle } from '@/components/theme/themedTitle';
import { useState } from 'react';
import { SettingsSection } from '@/components/settings/settingsSection';
import { SettingsRow } from '@/components/settings/settingsRow';
import { ApiKeyInput, ChevronValue, Toggle, ValueLabel } from '@/components/settings/settingsComponents';
import { useSettingsStore } from '@/store/settingsStore';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const {
    distanceUnit,
    daysInPast,
    setDistanceUnit,
    setDaysInPast
  } = useSettingsStore()

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
              title="Days in the past"
              right={<ChevronValue 
                value={daysInPast}
                onPress={() => 
                  setDaysInPast(daysInPast == 2 ? 4 : 2)
                } />}
            />
            <SettingsRow 
              icon={<Ionicons name="notifications-outline" size={18} color="#4a9eff" />}
              title="Hazard notifications"
              isLast
              right={<Toggle value={notifications} onToggle={() => setNotifications(prev => !prev)} />}
            />
          </SettingsSection>
          <SettingsSection label="Developer">
            <SettingsRow 
              icon={<Ionicons name="key-outline" size={18} color="#4a9eff" />}
              title="NASA API Key"
              subtitle="Leave blank to use default"
              right={<ApiKeyInput value={apiKey} onChange={setApiKey} />} 
            />
            <SettingsRow 
              icon={<Ionicons name="bug-outline" size={18} color="#4a9eff" />}
              title="Debug mode"
              isLast
              right={<Toggle value={debugMode} onToggle={() => setDebugMode(prev => !prev)} />} 
            />
          </SettingsSection>
          <SettingsSection label="About">
            <SettingsRow 
              icon={<Ionicons name="information-circle-outline" size={18} color="#4a9eff" />}
              title="Version"
              right={<ValueLabel value="1.0.0" />} 
            />
            <SettingsRow 
              icon={<Ionicons name="rocket-outline" size={18} color="#4a9eff" />}
              title="Data Source"
              isLast
              right={<ValueLabel value="NASA NeoWs" />} 
            />
          </SettingsSection>
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