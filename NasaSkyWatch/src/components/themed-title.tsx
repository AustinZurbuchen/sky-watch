import { StyleSheet, TextProps, View } from "react-native";

import { ThemedText } from "./themed-text";

export type ThemedTitleProps = TextProps & {
  title: String,
  subtitle: String
}

export function ThemedTitle({title, subtitle} : ThemedTitleProps) {
  return (
    <View id="content-title" style={styles.contentTitle}>
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>{subtitle}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  contentTitle: {
    height: '7%',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
    opacity: 0.5,
  },
})