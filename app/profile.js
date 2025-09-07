import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "./../colors"

import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import { submitProfile } from "../constants/api";

import Icon from "react-native-vector-icons/FontAwesome";

const Profile = ({ navigation }) => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Retrieve email from route params
  console.log("Received email:", email); // Debug log for email
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [dateOfBirth, setDateOfBirth] = useState(new Date("1990-01-01"));
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fixed email state initialization (removed incorrect destructuring)
  const [youremail, setYouremail] = useState(email || "");

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) console.log("User cancelled image picker");
        else if (response.error)
          console.log("ImagePicker Error: ", response.error);
        else if (response.assets && response.assets[0].uri)
          setProfilePicture(response.assets[0].uri);
      }
    );
  };

  const takePhoto = () => {
    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel) console.log("User cancelled camera");
        else if (response.error) console.log("Camera Error: ", response.error);
        else if (response.assets && response.assets[0].uri)
          setProfilePicture(response.assets[0].uri);
      }
    );
  };

  const uploadImageToCloudinary = async (uri) => {
    const data = new FormData();
    data.append("file", { uri, type: "image/jpeg", name: "profile.jpg" });
    data.append("upload_preset", "essential");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return null;
    }
  };

  const handleSave = async () => {
    let cloudinaryUrl = profilePicture;
    if (
      profilePicture.startsWith("file://") ||
      profilePicture.startsWith("content://")
    ) {
      cloudinaryUrl = await uploadImageToCloudinary(profilePicture);
      if (!cloudinaryUrl) {
        console.log("Image upload failed, using placeholder");
        cloudinaryUrl = "https://via.placeholder.com/150";
      }
    }

    // Client-side validation
    if (
      !email ||
      !firstName.trim() ||
      !lastName.trim() ||
      !cloudinaryUrl ||
      !dateOfBirth
    ) {
      console.log("Validation failed: All profile fields are required. Data:", {
        email,
        firstName,
        lastName,
        cloudinaryUrl,
        dateOfBirth,
      });
      return;
    }

    console.log("Sending data to backend:", {
      email,
      firstName,
      lastName,
      profilePicture: cloudinaryUrl,
      dateOfBirth: dateOfBirth.toISOString(),
      password: "defaultPassword",
    });
    try {
      const response = await submitProfile(
        email,
        firstName,
        lastName,
        cloudinaryUrl,
        dateOfBirth.toISOString(),
        "defaultPassword"
      );
      console.log("Profile saved successfully:", response.data);
      if (response.data.nextStep) {
        setTimeout(
          () =>
            router.push({
              pathname: `/${response.data.nextStep}`,
              params: { email },
            }),
          1500
        );
      }
    } catch (error) {
      console.error(
        "Profile save failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.content}>
          <Image
            source={require("../assets/images/datingLogo.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => {
                Alert.alert("Select Image", "Choose an option", [
                  { text: "Pick from Gallery", onPress: pickImage },
                  { text: "Take Photo", onPress: takePhoto },
                ]);
              }}
            >
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Profile Details</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {dateOfBirth.toLocaleDateString("en-US")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              display="calendar"
              onChange={onDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
              textColor="#000"
              accentColor="#FF0050"
              themeVariant="light"
            />
          )}
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
    ...(Platform.OS === "web" && {}),
    backgroundColor: "#fff", // Fallback for native
  },
  content: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: -10,
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "semibold",
    color: "#003", // Corrected from "#003" (invalid hex) to a valid color
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: "85%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#000",
    fontSize: 16,
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
  },
  inputText: {
    color: "#000",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: "80%",
    marginTop: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  datePicker: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 15,
    marginTop: 10,
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
  },
});

export default Profile;
