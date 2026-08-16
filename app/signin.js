import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter, Link } from "expo-router";
import { submitLogin } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { withKeyboardAvoiding } from "./utils/keyboardAvoiding";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await submitLogin({ email });
      await AsyncStorage.setItem("userEmail", email);
      router.push({ pathname: "/loginToken", params: { email } });
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return withKeyboardAvoiding(
    <View style={styles.container}>
      <View style={styles.topAccent} />

      <View style={styles.content}>
        <View style={styles.animationWrapper}>
          <LottieView
            source={require("../assets/images/Social media react animation.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your email to continue</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#C7807F" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setError(null);
              setEmail(text);
            }}
            placeholder="Email"
            placeholderTextColor="#B5A3A3"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color="#E8877A" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleNext}
          disabled={isLoading}
          activeOpacity={0.85}
          style={styles.buttonShadow}
        >
          <LinearGradient
            colors={isLoading ? ["#D9B8B8", "#D9B8B8"] : ["#FF6B6B", "#FF3D77"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Link href="/onboarding1" asChild>
          <TouchableOpacity style={styles.signupRow} activeOpacity={0.7}>
            <Text style={styles.signupText}>
              New to Let's Meet? <Text style={styles.signupAccent}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>,
    {
      behavior: Platform.OS === "ios" ? "padding" : "height",
      keyboardVerticalOffset: Platform.OS === "ios" ? 120 : 100,
      style: { flex: 1, backgroundColor: "#FFF8F5" },
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: "#FFE4E1",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  animationWrapper: {
    marginBottom: 4,
  },
  animation: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3D2C2E",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A7373",
    textAlign: "center",
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "#F3E4E2",
    shadowColor: "#3D2C2E",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3D2C2E",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  errorText: {
    fontSize: 12.5,
    color: "#E8877A",
    fontWeight: "600",
  },
  buttonShadow: {
    width: "100%",
    marginTop: 24,
    borderRadius: 999,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupRow: {
    marginTop: 22,
  },
  signupText: {
    fontSize: 14,
    color: "#8A7373",
  },
  signupAccent: {
    color: "#FF3D77",
    fontWeight: "700",
  },
});

export default Signin;