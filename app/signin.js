

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import colors from "./../colors"


import { useRouter } from "expo-router";
import { submitLogin } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { withKeyboardAvoiding } from "./utils/keyboardAvoiding";

import { Link } from "expo-router";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    router.push('/signup')
  }

  const handleNext = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      const response = await submitLogin({ email });
      await AsyncStorage.setItem('userEmail', email);
      console.log(response, "login response");
      router.push({ pathname: "/loginToken", params: { email } });
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Wrap the entire UI in withKeyboardAvoiding
  return withKeyboardAvoiding(
    <View style={styles.container}>
      <Image
        source={require("../assets/images/datingLogo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Enter your email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    
<Link href="/signup" asChild>
  <Text style={styles.signupButton} className="signup-link">
    New to Let's Meet? Sign up
  </Text>
</Link>
    </View>,
    {
      behavior: Platform.OS === "ios" ? "padding" : "height",
      keyboardVerticalOffset: Platform.OS === "ios" ? 120 : 100, // Adjust as needed
      style: { flex: 1, backgroundColor: colors.background }, // Match container styles
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    padding: 30,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "85%",
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: "85%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupButton:{
    marginTop:25
  },
});

export default Signin;
