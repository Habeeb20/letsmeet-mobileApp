



import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { submitEmail } from "../constants/api";

const EmailInput = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    isSuccess: true,
  });

  const animationRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const showNotification = (message, isSuccess) => {
    setNotification({ visible: true, message, isSuccess });
  };

  const handleNext = async () => {
    if (!email) {
      showNotification("Please enter an email", false);
      return;
    }

    setLoading(true);
    try {
      const response = await submitEmail(email);
      if (response.status === 200) {
        showNotification("Email submitted successfully!", true);
        setTimeout(
          () => router.push({ pathname: "/codeverification", params: { email } }),
          1200
        );
      }
    } catch (error) {
      console.error("Email submission failed:", error);
      showNotification("Failed to submit email. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification.visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start(() => setNotification((prev) => ({ ...prev, visible: false })));
        }, 2000);
      });
    }
  }, [notification.visible]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <View style={styles.container}>
        <View style={styles.topAccent} />

        <View style={styles.content}>
          {/* Step indicator */}
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>

          {/* Animation */}
          <View style={styles.animationWrapper}>
            <LottieView
              ref={animationRef}
              // swap this for your actual love/heart-themed Lottie asset —
              // this path is a placeholder matching the pattern of your other screens' assets

                     source={require("../assets/images/Online chat.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          {/* Copy */}
          <Text style={styles.title}>What's your email?</Text>
          <Text style={styles.subtitle}>
            We'll send you a code to verify it's really you
          </Text>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#C7807F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#B5A3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.buttonShadow}
          >
            <LinearGradient
              colors={loading ? ["#D9B8B8", "#D9B8B8"] : ["#FF6B6B", "#FF3D77"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {notification.visible && (
          <Animated.View
            style={[
              styles.notification,
              {
                opacity: fadeAnim,
                backgroundColor: notification.isSuccess ? "#3FAE7A" : "#E8877A",
              },
            ]}
          >
            <Ionicons
              name={notification.isSuccess ? "checkmark-circle" : "alert-circle"}
              size={18}
              color="#fff"
            />
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 70,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0C4C9",
  },
  stepDotActive: {
    width: 22,
    backgroundColor: "#FF3D77",
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: "#F0C4C9",
    marginHorizontal: 4,
  },
  animationWrapper: {
    marginBottom: 8,
  },
  animation: {
    width: 180,
    height: 180,
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
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 10,
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
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3D2C2E",
  },
  buttonShadow: {
    width: "100%",
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
  notification: {
    position: "absolute",
    bottom: 30,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});

export default EmailInput;