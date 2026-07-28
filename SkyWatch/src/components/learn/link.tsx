import { Linking, Pressable, StyleSheet, View } from "react-native"
import { ThemedText } from "../theme/themedText";
import { Ionicons } from "@expo/vector-icons";

export const CneosLink = () => {
  const handlePress = () => {
    Linking.openURL('https://cneos.jpl.nasa.gov');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.cneosBtn, pressed && styles.cneosBtnPressed]}
    >
      <View style={styles.cneosLeft}>
        <View style={styles.cneosIconWrap}>
          <Ionicons name="rocket-outline" size={18} color="#4a9eff" />
        </View>
        <View>
          <ThemedText style={styles.cneosTitle}>NASA CNEOS</ThemedText>
          <ThemedText style={styles.cneosSub}>Center for Near Earth Object Studies</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.cneosArrow}>↗</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cneosBtn: {
    marginTop: 12,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#2a3a5a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cneosBtnPressed: {
    opacity: 0.7,
  },
  cneosLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cneosIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0f2240',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cneosIcon: {
    fontSize: 18,
  },
  cneosTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  cneosSub: {
    fontSize: 12,
    color: '#6b7599',
    marginTop: 2,
  },
  cneosArrow: {
    fontSize: 18,
    color: '#4a9eff',
  },
})