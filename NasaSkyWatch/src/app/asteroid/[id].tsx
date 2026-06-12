import { ThemedText } from "@/components/theme/themedText";
import { Asteroids } from "@/constants/constants";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AsteroidDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const asteroid = Asteroids.find((asteroid) => asteroid.id === id);

  if (!asteroid) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={(() => router.back())} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#aab0cc" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Asteroid Detail</ThemedText>
        </View>

        <View style={styles.nameRow}>
          <View style={styles.nameLeft}>
            <ThemedText style={styles.name}>{asteroid.name}</ThemedText>
            <ThemedText style={styles.nameSubtitle}>
              Near-Earth Object · {asteroid.isHazardous ? 'PHA' : 'NEO'}
            </ThemedText>
          </View>
          <View style={[styles.badge, asteroid.isHazardous ? styles.badgeHazard : styles.badgeSafe]}>
            <ThemedText style={[styles.badgeText, asteroid.isHazardous ? styles.badgeTextHazard : styles.badgeTextSafe]}>
              {asteroid.isHazardous ? 'Hazardous' : 'Safe'}
            </ThemedText>
          </View>
        </View>

        {asteroid.isHazardous && (
          <View style={styles.hazardBanner}>
            <Ionicons name="warning-outline" size={22} color="#ff6060" />
            <ThemedText style={styles.hazardText}>
              This asteroid is classified as potentially hazardous due to its size and orbital proximity to Earth.
            </ThemedText>
          </View>
        )}

        <ThemedText style={styles.sectionLabel}>Close Approach</ThemedText>
        <View style={styles.detailCard}>
          <DetailRow label="Date" value={asteroid.date} />
          <DetailRow label="Time (UTC)" value={asteroid.closestApproachUtc} />
          <DetailRow label="Miss Distance" value={`${asteroid.missDistanceLD} LD`} />
          <DetailRow label="Velocity" value={`${asteroid.velocityKms} km/s`} isLast />
        </View>

        <ThemedText style={styles.sectionLabel}>Physical Properties</ThemedText>
        <View style={styles.detailCard}>
          <DetailRow label="Est. Diameter" value={`${asteroid.diameterMinM}-${asteroid.diameterMaxM}m`} />
          <DetailRow label="Absolute Magnitude" value={`${asteroid.absoluteMagnitude}`} />
          <DetailRow label="Orbit Class" value={asteroid.orbitClass} isLast/>
        </View>

        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && {opacity: 0.7 }]}>
          <Ionicons name="bookmark-outline" size={20} color="#4a9eff" />
          <ThemedText style={styles.saveBtnText}>Save to Watchlist</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const DetailRow = ({ label, value, isLast }: DetailRowProps) => {
  return (
    <View style={[detailRowStyles.row, !isLast && detailRowStyles.border]}>
      <ThemedText style={detailRowStyles.label}>{label}</ThemedText>
      <ThemedText style={detailRowStyles.value}>{value}</ThemedText>
    </View>
  );
};

const detailRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1f30',
  },
  label: {
    fontSize: 13,
    color: '#6b7599',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.dark.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0d1a',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  nameLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
  },
  nameSubtitle: {
    fontSize: 13,
    color: '#6b7599',
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  badgeSafe: { backgroundColor: '#0f2240' },
  badgeHazard: { backgroundColor: '#2a0f0f' },
  badgeText: { fontSize: 12, fontWeight: '500' },
  badgeTextSafe: { color: '#4a9eff' },
  badgeTextHazard: { color: '#ff6060' },
  hazardBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1f0a0a',
    borderWidth: 0.5,
    borderColor: '#5a1a1a',
    borderRadius: 16,
    padding: 14,
  },
  hazardText: {
    flex: 1,
    fontSize: 13,
    color: '#cc8080',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7599',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingBottom: 8,
    marginTop: 4,
  },
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: '#0f2240',
    borderWidth: 0.5,
    borderColor: '#2a4a7a',
    borderRadius: 16,
    padding: 14,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a9eff',
  },
});