import { Pressable, StyleSheet, TextInput, View } from "react-native"
import { ThemedText } from "../theme/themed-text"

export const ChevronValue = ({ value }: { value: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
    <ThemedText style={{ color: '#6b7599', fontSize: 13 }}>{value}</ThemedText>
    <ThemedText style={{ color: '#6b7599', fontSize: 13 }}>{`›`}</ThemedText>
  </View>
);

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