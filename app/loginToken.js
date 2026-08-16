import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { submitLogin } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginToken = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true, easing: Easing.linear }),
    ]).start();
  };

  const handleLogin = async () => {
    if (token.length !== 4) {
      setError("Enter the full 4-digit code");
      triggerShake();
      return;
    }

    setError(null);
    setVerifying(true);
    try {
      const response = await submitLogin({ email, token });
      await AsyncStorage.setItem("authToken", response.token);
      router.push({ pathname: "/dashboard", params: { token: response?.token } });
    } catch (err) {
      console.error("Token verification error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid or expired code");
      triggerShake();
      setToken("");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    try {
      await submitLogin({ email });
    } catch (err) {
      console.error("Resend failed:", err.response?.data || err.message);
      setError("Couldn't resend the code. Please try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  const renderDigitBoxes = () => {
    const digits = token.padEnd(4, " ").split("");
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.digitsRow}
      >
        {digits.map((digit, i) => (
          <View
            key={i}
            style={[
              styles.digitBox,
              i === token.length && styles.digitBoxActive,
              error && styles.digitBoxError,
            ]}
          >
            <Text style={styles.digitText}>{digit.trim()}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  return (
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

        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 4-digit code to{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }], width: "100%" }}>
          {renderDigitBoxes()}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={token}
            onChangeText={(text) => {
              setError(null);
              setToken(text.replace(/[^0-9]/g, "").slice(0, 4));
            }}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
          />
        </Animated.View>

        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color="#E8877A" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={verifying}
          activeOpacity={0.85}
          style={styles.buttonShadow}
        >
          <LinearGradient
            colors={verifying ? ["#D9B8B8", "#D9B8B8"] : ["#FF6B6B", "#FF3D77"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {verifying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Verify</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendRow}>
          <Text style={styles.resendText}>
            Didn't get a code?{" "}
            <Text style={styles.resendAccent}>{resending ? "Sending…" : "Resend"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    height: 240,
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
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D2C2E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A7373",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: "700",
    color: "#3D2C2E",
  },
  digitsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },
  digitBox: {
    width: 56,
    height: 62,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#F3E4E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3D2C2E",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  digitBoxActive: {
    borderColor: "#FF3D77",
    borderWidth: 2,
  },
  digitBoxError: {
    borderColor: "#E8877A",
  },
  digitText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D2C2E",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  errorText: {
    fontSize: 12.5,
    color: "#E8877A",
    fontWeight: "600",
  },
  buttonShadow: {
    width: "100%",
    marginTop: 28,
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
  resendRow: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 13,
    color: "#8A7373",
  },
  resendAccent: {
    color: "#FF3D77",
    fontWeight: "700",
  },
});

export default LoginToken;