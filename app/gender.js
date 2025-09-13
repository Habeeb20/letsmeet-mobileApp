import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import { useRouter, useLocalSearchParams } from "expo-router";
import { submitGender } from "../constants/api";
import { Platform } from "react-native";

const Gender = ({ navigation }) => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [selectedGender, setSelectedGender] = useState(null);

  // Submit gender data to backend
  const handleContinue = async () => {
    if (!selectedGender) {
      console.log("Please select a gender");
      return;
    }

    try {
      const response = await submitGender(email, selectedGender);
      console.log("Gender saved:", response.data);
      if (response.data.nextStep) {
        setTimeout(
          () =>
            router.push({
              pathname: `/${response.data.nextStep}`,
              params:{email},
            }),
          1500
        );
      }
    } catch (error) {
      console.error("Gender save failed:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>I am a</Text>
          <View style={styles.genderOptions}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === "female" && styles.selectedButton,
              ]}
              onPress={() => setSelectedGender("female")}
            >
              <Text
                style={[
                  styles.genderText,
                  selectedGender === "female" && styles.selectedText,
                ]}
              >
                Woman
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === "male" && styles.selectedButton,
              ]}
              onPress={() => setSelectedGender("male")}
            >
              <Text
                style={[
                  styles.genderText,
                  selectedGender === "male" && styles.selectedText,
                ]}
              >
                Man
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={!selectedGender}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    // Web-compatible gradient using backgroundImage
    ...(Platform.OS === "web" && {}),
    // Fallback solid color for native (Expo Go)
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
    marginTop:15
  },
  title: {
    fontSize: 32,
    fontWeight: "semibold",
    color: "#000",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  genderOptions: {
    width: "85%",
    marginBottom: 15,
    marginTop:25
  },
  genderButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    marginTop: 35,
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  genderText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: "80%",
    marginTop: "60%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Gender;
