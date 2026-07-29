import { Pressable, StyleSheet, TextInput, View } from "react-native"
import { ThemedText } from "../theme/themedText"
import { Ionicons } from "@expo/vector-icons";

interface ChevronProps {
  value: string | number;
  onPress?: () => void;
}

export const ChevronValue = ({ value, onPress }: ChevronProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [ chevronStyles.container, pressed && { opacity: 0.7 }]}>
    <ThemedText style={chevronStyles.value}>{value}</ThemedText>
    <Ionicons name="chevron-forward" size={16} color="#6b7599" />
  </Pressable>
);

const chevronStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: '#6b7599',
    fontSize: 13,
  },
});

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export const Toggle = ({ value, onToggle }: ToggleProps) => (
  <Pressable onPress={onToggle} style={[toggleStyles.track, value && toggleStyles.trackOn]}>
    <View style={[toggleStyles.knob, value && toggleStyles.knobOn]} />
  </Pressable>
);

const toggleStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2a3050',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    backgroundColor: '#4a9eff',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});

export const ValueLabel = ({ value }: { value: string }) => (
  <ThemedText style={{ color: '#6b7599', fontSize: 13 }}>{value}</ThemedText>
);

export const ApiKeyInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <TextInput
    value={value}
    onChangeText={onChange}
    placeholder="DEMO_KEY"
    placeholderTextColor="#4a5070"
    style={{
      backgroundColor: '#0d1124',
      borderWidth: 0.5,
      borderColor: '#2a3050',
      borderRadius: 8,
      color: '#8890b0',
      fontSize: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      width: 120,
      fontFamily: 'monospace',
    }}
  />
)