import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../colors";

export default function OnboardingDots({ total, activeIndex }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary + "40",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});