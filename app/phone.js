import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "./../colors"

import { useRouter, useLocalSearchParams } from "expo-router";
import { submitPhone } from "../constants/api";

const phone = ({ navigation }) => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Retrieve email from route params
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234"); // Static country code for Nigeria
  const [emailState, setEmailState] = useState(email || "");

  console.log(email);
  useEffect(() => {
    console.log("phone.js mounted", { emailState, countryCode, phone }); // Debug log
  }, [emailState, countryCode, phone]);

  // Submit phone number to backend
  const handleNext = async () => {
    try {
      const fullPhoneNumber = `${countryCode}${phone}`;
      console.log("handleNext called", { emailState, fullPhoneNumber }); // Debug log
      const response = await submitPhone(emailState, fullPhoneNumber); // Send email and phone
      console.log("Phone submitted:", response.data);
      if (response.status === 200) {
        setTimeout(
          () =>
            router.push({
              pathname: "/profile",
              params: { email: emailState },
            }),
          1500
        );
      }
    } catch (error) {
      console.error("Phone submission failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/datingLogo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Enter your phone number</Text>
      <View style={styles.phoneInputContainer}>
        <Text style={styles.countryCodeText}>{countryCode}</Text>{" "}
        {/* Static country code */}
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="1234567890"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  countryCodeText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 25,
    marginRight: 10,
    color: colors.textPrimary,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
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
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default phone;
