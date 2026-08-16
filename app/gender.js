// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import Footer from "./others/Footer"
// import colors from "./../colors"
// import LoveLoader from "./others/LoveLoader";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { submitGender } from "../constants/api";
// import { Platform } from "react-native";

// const Gender = ({ navigation }) => {
//   const router = useRouter();
//   const { email } = useLocalSearchParams();
//   const [selectedGender, setSelectedGender] = useState(null);

//   // Submit gender data to backend
//   const handleContinue = async () => {
//     if (!selectedGender) {
//       console.log("Please select a gender");
//       return;
//     }

//     try {
//       const response = await submitGender(email, selectedGender);
//       console.log("Gender saved:", response.data);
//       if (response.data.nextStep) {
//         setTimeout(
//           () =>
//             router.push({
//               pathname: `/${response.data.nextStep}`,
//               params:{email},
//             }),
//           1500
//         );
//       }
//     } catch (error) {
//       console.error("Gender save failed:", error);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.gradient}>
//         <View style={styles.content}>
//           <Text style={styles.title}>I am a</Text>
//           <View style={styles.genderOptions}>
//             <TouchableOpacity
//               style={[
//                 styles.genderButton,
//                 selectedGender === "female" && styles.selectedButton,
//               ]}
//               onPress={() => setSelectedGender("female")}
//             >
//               <Text
//                 style={[
//                   styles.genderText,
//                   selectedGender === "female" && styles.selectedText,
//                 ]}
//               >
//                 Woman
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.genderButton,
//                 selectedGender === "male" && styles.selectedButton,
//               ]}
//               onPress={() => setSelectedGender("male")}
//             >
//               <Text
//                 style={[
//                   styles.genderText,
//                   selectedGender === "male" && styles.selectedText,
//                 ]}
//               >
//                 Man
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity
//             style={styles.continueButton}
//             onPress={handleContinue}
//             disabled={!selectedGender}
//           >
//             <Text style={styles.continueButtonText}>Continue</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//     // Web-compatible gradient using backgroundImage
//     ...(Platform.OS === "web" && {}),
//     // Fallback solid color for native (Expo Go)
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 40,
//     marginTop:15
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "semibold",
//     color: "#000",
//     textAlign: "center",
//     marginBottom: 40,
//     textShadowColor: "#000",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   genderOptions: {
//     width: "85%",
//     marginBottom: 15,
//     marginTop:25
//   },
//   genderButton: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     borderRadius: 25,
//     paddingVertical: 15,
//     marginBottom: 20,
//     marginTop: 35,
//     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
//   },
//   selectedButton: {
//     backgroundColor: colors.primary,
//   },
//   genderText: {
//     color: colors.primary,
//     fontSize: 20,
//     fontWeight: "500",
//     textAlign: "center",
//   },
//   selectedText: {
//     color: "#fff",
//   },
//   continueButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 50,
//     borderRadius: 25,
//     width: "80%",
//     marginTop: "60%",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//   },
//   continueButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });

// export default Gender;






import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { submitGender } from "../constants/api";

const GENDER_OPTIONS = [
  { key: "female", label: "Woman", icon: "female-outline" },
  { key: "male", label: "Man", icon: "male-outline" },
];

const Gender = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [selectedGender, setSelectedGender] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const scaleAnims = useRef({
    female: new Animated.Value(1),
    male: new Animated.Value(1),
  }).current;

  const handleSelect = (key) => {
    setError(null);
    setSelectedGender(key);
    Animated.sequence([
      Animated.timing(scaleAnims[key], { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnims[key], { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!selectedGender) {
      setError("Please select an option to continue");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await submitGender(email, selectedGender);
      if (response.data.nextStep) {
        router.push({ pathname: `/${response.data.nextStep}`, params: { email } });
      }
    } catch (err) {
      console.error("Gender save failed:", err.response?.data || err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topAccent} />

      <View style={styles.content}>
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={styles.stepDot} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>I am a</Text>
          <Text style={styles.subtitle}>This helps us find the right matches for you</Text>
        </View>

        <View style={styles.genderOptions}>
          {GENDER_OPTIONS.map(({ key, label, icon }) => {
            const isSelected = selectedGender === key;
            return (
              <Animated.View key={key} style={{ transform: [{ scale: scaleAnims[key] }] }}>
                <TouchableOpacity
                  onPress={() => handleSelect(key)}
                  activeOpacity={0.9}
                  style={styles.genderButtonShadow}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#FF6B6B", "#FF3D77"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.genderButton}
                    >
                      <View style={styles.genderIconWrapSelected}>
                        <Ionicons name={icon} size={22} color="#FF3D77" />
                      </View>
                      <Text style={styles.genderTextSelected}>{label}</Text>
                      <Ionicons name="checkmark-circle" size={22} color="#fff" style={styles.checkIcon} />
                    </LinearGradient>
                  ) : (
                    <View style={styles.genderButtonOutline}>
                      <View style={styles.genderIconWrap}>
                        <Ionicons name={icon} size={22} color="#C7807F" />
                      </View>
                      <Text style={styles.genderText}>{label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color="#E8877A" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.85}
          style={styles.buttonShadow}
        >
          <LinearGradient
            colors={
              !selectedGender
                ? ["#E5D5D2", "#E5D5D2"]
                : saving
                ? ["#D9B8B8", "#D9B8B8"]
                : ["#FF6B6B", "#FF3D77"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "#FFE4E1",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 56,
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
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3D2C2E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13.5,
    color: "#8A7373",
    textAlign: "center",
    marginTop: 8,
  },
  genderOptions: {
    width: "100%",
    gap: 14,
  },
  genderButtonShadow: {
    borderRadius: 20,
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  genderButtonOutline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "#F3E4E2",
    shadowColor: "#3D2C2E",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  genderIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFE4E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  genderIconWrapSelected: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  genderText: {
    color: "#3D2C2E",
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
  },
  genderTextSelected: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  errorText: {
    fontSize: 12.5,
    color: "#E8877A",
    fontWeight: "600",
  },
  buttonShadow: {
    width: "100%",
    marginTop: 40,
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
});

export default Gender;