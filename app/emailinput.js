import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import { submitEmail } from "../constants/api";
import { useRouter } from "expo-router"; // Import useRouter

const emailInput = () => {
  const router = useRouter(); // Use useRouter instead of navigation prop
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    isSuccess: true,
  });

  // Animation for notification
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleNext = async () => {
    if (!email) {
      setNotification({
        visible: true,
        message: "Please enter an email",
        isSuccess: false,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await submitEmail(email);
      console.log("Email submitted:", response.data);
      if (response.status === 200) {
        setNotification({
          visible: true,
          message: "Email submitted successfully!",
          isSuccess: true,
        });
        setTimeout(
          () =>
            router.push({ pathname: "/codeverification", params: { email } }),
          1500
        );
      }
    } catch (error) {
      console.error("Email submission failed:", error);
      setNotification({
        visible: true,
        message: "Failed to submit email. Please try again.",
        isSuccess: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification animation
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
          }).start(() => setNotification({ ...notification, visible: false }));
        }, 2000); // Show for 2 seconds
      });
    }
  }, [notification.visible, fadeAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
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
          placeholder="example@email.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.buttonText} />
          ) : (
            <Text style={styles.buttonText}>Next</Text>
          )}
        </TouchableOpacity>
        {notification.visible && (
          <Animated.View
            style={[
              styles.notification,
              {
                opacity: fadeAnim,
                backgroundColor: notification.isSuccess ? "#28a745" : "#dc3545",
              },
            ]}
          >
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: colors.textPrimary,
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
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  notification: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 10,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "small",
  },
});

export default emailInput;
