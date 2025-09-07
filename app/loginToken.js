

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
} from "react-native";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import { useRouter, useLocalSearchParams } from "expo-router";
import { submitLogin } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginToken = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!token.trim() || token.length !== 4) {
      Alert.alert("Error", "Please enter a 4-digit code");
      return;
    }
    setIsLoading(true);
    try {
      const response = await submitLogin({ email, token });
      console.log(response, "your data!!!");
      await AsyncStorage.setItem("authToken", response.token);
      router.push({
        pathname: "/dashboard",
        params: { token: response?.token },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Invalid or expired code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/datingLogo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>Check your email for the 4-digit code</Text>
      <TextInput
        style={styles.input}
        value={token}
        onChangeText={setToken}
        placeholder="1234"
        keyboardType="numeric"
        maxLength={4}
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
    textAlign: "center",
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
});

export default LoginToken;
