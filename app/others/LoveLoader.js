import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../colors"

const LoveLoader = ({ visible }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Controls scale (pulsate)
  const rotateAnim = useRef(new Animated.Value(0)).current; // Controls rotation
  const opacityAnim = useRef(new Animated.Value(1)).current; // Controls opacity

  useEffect(() => {
    if (visible) {
      // Pulsating animation (scale up and down)
      const scale = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      // Rotation animation
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      // Opacity animation (subtle fade)
      const opacity = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations
      Animated.parallel([scale, rotate, opacity]).start();

      return () => {
        // Reset animations when component unmounts or visible changes
        scaleAnim.setValue(1);
        rotateAnim.setValue(0);
        opacityAnim.setValue(1);
      };
    }
  }, [visible]);

  if (!visible) return null;

  // Convert rotation value to degrees
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            transform: [{ scale: scaleAnim }, { rotate }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Icon name="heart" size={60} color={colors.heart || "#ff4d4d"} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // High zIndex to overlay other content
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Subtle white glow
    borderRadius: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default LoveLoader;
