// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import Footer from "./others/Footer"
// import colors from "./../colors";

// import LoveLoader from "./others/LoveLoader";
// import { useRouter, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
// import { verifyCode } from "../constants/api"; // Import the API function

// const codeverification = ({ navigation }) => {
//   const router = useRouter();
//   const { email } = useLocalSearchParams(); // Retrieve email from route params
//   const [code, setCode] = useState("");
//   const [emailState, setEmailState] = useState(email || "");

//   // Verify code and navigate
//   const handleVerify = async () => {
//     try {
//       const response = await verifyCode(emailState, code);
//       console.log("Code verified:", response.data);
//       if (response.status === 200) {
//         setTimeout(
//           () =>
//             router.push({ pathname: "/phone", params: { email: emailState } }),
//           1500
//         );
//       }
//     } catch (error) {
//       console.error("Code verification failed:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/Social media react animation.json")}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//       <Text style={styles.title}>Enter verification code</Text>
//       <Text style={styles.subtitle}>Check your email for a 4-digit code</Text>
//       <TextInput
//         style={styles.input}
//         value={code}
//         onChangeText={setCode}
//         placeholder="1234"
//         placeholderTextColor={colors.textSecondary}
//         keyboardType="number-pad"
//         maxLength={4}
//         textAlign="center"
//       />
//       <TouchableOpacity style={styles.button} onPress={handleVerify}>
//         <Text style={styles.buttonText}>Verify</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 30,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: colors.textPrimary,
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     width: "60%",
//     height: 50,
//     borderColor: colors.textSecondary,
//     borderWidth: 1,
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     color: colors.textPrimary,
//     textAlign: "center",
//   },
//   button: {
//     backgroundColor: colors.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 50,
//     borderRadius: 30,
//     width: "85%",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

// export default codeverification;



import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { verifyCode, submitEmail } from "../constants/api";

const CodeVerification = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
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

  const handleVerify = async () => {
    if (code.length !== 4) {
      setError("Enter the full 4-digit code");
      triggerShake();
      return;
    }

    setError(null);
    setVerifying(true);
    try {
      const response = await verifyCode(email, code);
      if (response.status === 200) {
        router.push({ pathname: "/phone", params: { email } });
      }
    } catch (err) {
      console.error("Code verification failed:", err.response?.data || err.message);
      setError("That code doesn't look right. Please try again.");
      triggerShake();
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    try {
      await submitEmail(email);
    } catch (err) {
      console.error("Resend failed:", err.response?.data || err.message);
      setError("Couldn't resend the code. Please try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  // renders each of the 4 digits into its own box, driven by one hidden TextInput
  const renderDigitBoxes = () => {
    const digits = code.padEnd(4, " ").split("");
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
              i === code.length && styles.digitBoxActive,
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
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={styles.stepDot} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View>

        {/* Animation */}
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

        {/* Hidden real input driving the digit boxes */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }], width: "100%" }}>
          {renderDigitBoxes()}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={(text) => {
              setError(null);
              setCode(text.replace(/[^0-9]/g, "").slice(0, 4));
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
          onPress={handleVerify}
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

export default CodeVerification;