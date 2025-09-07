import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./../colors"

import { useRouter } from "expo-router";

const SignUp = ({ navigation }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/datingLogo.jpeg")} // Use require for local assets
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign up to continue</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/emailinput")}
      >
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Use phone number</Text>
      </TouchableOpacity> */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Text style={styles.socialText}>f</Text> {/* Wrapped in <Text> */}
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.socialText}>G</Text> {/* Wrapped in <Text> */}
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.socialText}></Text> {/* Wrapped in <Text> */}
        </TouchableOpacity>
      </View>
      <Text style={styles.terms}>Terms of use | Privacy Policy</Text>
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
  logo: {
    width: 120, // Increased for prominence, adjust based on image
    height: 120,
    marginBottom: 30, // Increased spacing
  },
  title: {
    fontSize: 28, // Slightly larger for emphasis
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF0050", // Adjusted to a pure red, replace with exact hex from image if known
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30, // Slightly larger radius for a modern look
    marginBottom: 15,
    width: "85%", // Slightly wider for better touch area
    elevation: 2, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18, // Slightly larger for readability
    fontWeight: "bold",
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%", // Adjusted for better spacing
    marginTop: 25,
  },
  socialText: {
    fontSize: 28, // Larger for better visibility
    color: colors.textPrimary,
    fontWeight: "bold", // Added weight for icon-like appearance
  },
  terms: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 25,
    textDecorationLine: "underline", // Common for terms links
  },
});

export default SignUp;
