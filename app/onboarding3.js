import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./../colors"

import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";

const Onboarding3 = () => {
  const router = useRouter();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/pictures1.jpeg")} // Left side image
          style={[styles.sideImage, { left: -50 }]}
        />
        <Image
          source={require("../assets/images/picture4.jpeg")} // Central image
          style={styles.centralImage}
        />
        <Image
          source={require("../assets/images/picture3.jpeg")} // Right side image
          style={[styles.sideImage, { right: -50 }]}
        />
      </View>
      <Text style={styles.title}>Premium</Text>
      <Text style={styles.subtitle}>
        Sign up today and enjoy the first month of premium benefits on us.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("signup")}
      >
        <Text style={styles.buttonText}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/signin")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  centralImage: {
    width: 250,
    height: 350,
    resizeMode: "contain",
  },
  sideImage: {
    width: 100,
    height: 350,
    resizeMode: "contain",
    position: "absolute",
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    textAlign: "center",
  },
});

export default Onboarding3;
