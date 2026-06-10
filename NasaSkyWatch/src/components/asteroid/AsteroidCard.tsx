import { AsteroidCardProps } from "@/types"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../theme/themedText"
import { Colors } from '@/constants/theme';

export const AsteroidCard = ({ asteroid, isHazardous }: AsteroidCardProps) => {
  return (
    <View style={[styles.asteroidContainer, isHazardous && styles.cardHazardous]}>
      <View style={[styles.iconWrap, isHazardous ? styles.iconWrapDanger : styles.iconWrapSafe]}>
        <ThemedText style={[styles.iconText, isHazardous ? styles.iconTextDanger : styles.iconTextSafe]}>
          {isHazardous ? '⚠' : '●'}
        </ThemedText>
      </View>
      <View style={styles.left}>
        <ThemedText style={styles.name} >{asteroid.name}</ThemedText>
        <ThemedText style={styles.subName} >Closest: {asteroid.closestApproachUtc} · {asteroid.diameterMaxM}m est.</ThemedText>
      </View>
      <View style={styles.right}>
        <ThemedText style={styles.distance} >{asteroid.missDistanceLD} LD</ThemedText>
        <View style={[styles.badge, isHazardous ? styles.badgeHazardous : styles.badgeSafe]}>
          <ThemedText style={[styles.badgeText, isHazardous ? styles.badgeTextHazardous : styles.badgeTextSafe]}>
            {isHazardous ? 'Hazardous' : 'Safe'}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  asteroidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111627',
    borderWidth: 0.5,
    borderColor: '#1e2340',
    borderRadius: 16,
    padding: 14,
  },
  cardHazardous: {
    backgroundColor: '#130e0e',
    borderColor: '#3d1f1f',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapSafe: {
    backgroundColor: '#0f2240',
  },
  iconWrapDanger: {
    backgroundColor: '#2a0f0f',
  },
  iconText: {
    fontSize: 18,
  },
  iconTextSafe: {
    color: '#4a9eff',
  },
  iconTextDanger: {
    color: '#ff6060',
  },
  left: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontWeight: '500',
    color: Colors.dark.text,
  },
  subName: {
    color: Colors.dark.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  distance: {
    fontWeight: '500',
    color: '#aab0cc',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeSafe: {
    backgroundColor: '#0f2240',
  },
  badgeHazardous: {
    backgroundColor: '#2a0f0f',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeTextSafe: {
    color: '#4a9eff',
  },
  badgeTextHazardous: {
    color: '#ff6060',
  },
})