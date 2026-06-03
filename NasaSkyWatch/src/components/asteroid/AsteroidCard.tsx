import { AsteroidCardProps } from "@/types"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../theme/themed-text"

export const AsteroidCard = ({ asteroid, isHazardous }: AsteroidCardProps) => {
  return (
    <View style={styles.asteroidContainer}>
      <View style={styles.left}>
        <ThemedText >{asteroid.name}</ThemedText>
        <ThemedText >Closest: {asteroid.closestApproachUtc} · {asteroid.diameterMaxM}m est.</ThemedText>
      </View>
      <View style={styles.right}>
        <ThemedText >{asteroid.missDistanceLD} LD</ThemedText>
        <ThemedText >{isHazardous ? 'Hazardous' : 'Safe'}</ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  asteroidContainer: {

  },
  left: {

  },
  right: {

  }
})