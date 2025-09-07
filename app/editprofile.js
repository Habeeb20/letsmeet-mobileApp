import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Footer from "./others/Footer";
import colors from "./../colors";
import LoveLoader from "./others/LoveLoader";
import { updateProfile, fetchProfile } from "../constants/api";
import { withKeyboardAvoiding } from "./utils/keyboardAvoiding";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import api from "../constants/api";
const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    dateOfBirth: "",
    gender: "",
    interests: [],
    aboutMe: [],
    myFaith: [],
    personality: [],
    languages: [],
    ethnicity: [],
    age: "",
    bio: "",
    education: "",
    contactsFiltered: [],
    notificationsEnabled: false,
    gallery: [],
  });
  const [loading, setLoading] = useState(false);

  // Fetch user data to prefill
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          console.log("failed to get the token")
          return;
        }
        const response = await api.get("/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleInputChange = (name, value) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setUser((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleImageUpload = async (field) => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        const file = result.assets[0];
        const data = new FormData();
        data.append("file", {
          uri: file.uri,
          type: file.type || "image/jpeg",
          name: file.fileName || "image.jpg",
        });
        data.append("upload_preset", "your_upload_preset");
        data.append("api_key", "your_api_key");
        data.append("timestamp", (Date.now() / 1000) | 0);

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          { method: "POST", body: data }
        );
        const result = await res.json();
        setUser((prev) => ({ ...prev, [field]: result.secure_url }));
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
      if (!result.canceled) {
        const uploadPromises = result.assets.map((file) => {
          const data = new FormData();
          data.append("file", {
            uri: file.uri,
            type: file.type || "image/jpeg",
            name: file.fileName || "image.jpg",
          });
          data.append("upload_preset", " essential");
          data.append("api_key", "624216876378923");
          data.append("timestamp", (Date.now() / 1000) | 0);
          return fetch(
            "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
            { method: "POST", body: data }
          ).then((res) => res.json());
        });
        const responses = await Promise.all(uploadPromises);
        const urls = responses.map((res) => res.secure_url);
        setUser((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
      }
    } catch (error) {
      console.error("Gallery upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.push("/signin");
        return;
      }
      const response = await updateProfile(user, token);
      console.log("Profile updated", response.data);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = [
    "Photography",
    "Shopping",
    "Karaoke",
    "Yoga",
    "Cooking",
    "Tennis",
    "Run",
    "Swimming",
    "Art",
    "Traveling",
    "Extreme",
    "Music",
    "Drink",
    "Video games",
  ];
  const aboutMeOptions = [
    "Adventurous",
    "Creative",
    "Funny",
    "Kind",
    "Outgoing",
  ];
  const myFaithOptions = [
    "Christianity",
    "Islam",
    "Buddhism",
    "Hinduism",
    "Other",
  ];
  const personalityOptions = [
    "Introvert",
    "Extrovert",
    "Ambitious",
    "Calm",
    "Optimistic",
  ];
  const languagesOptions = [
    "English",
    "Spanish",
    "French",
    "Arabic",
    "Swahili",
  ];
  const ethnicityOptions = [
    "African",
    "Asian",
    "Caucasian",
    "Hispanic",
    "Mixed",
  ];

  return withKeyboardAvoiding(
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {loading && <LoveLoader />}
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(text) => handleInputChange("email", text)}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={user.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={user.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={user.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        placeholder="Last Name"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleImageUpload("profilePicture")}
      >
        <Text style={styles.buttonText}>Upload Profile Picture</Text>
      </TouchableOpacity>
      {user.profilePicture && (
        <Image source={{ uri: user.profilePicture }} style={styles.image} />
      )}
      <TextInput
        style={styles.input}
        value={user.dateOfBirth}
        onChangeText={(text) => handleInputChange("dateOfBirth", text)}
        placeholder="Date of Birth (YYYY-MM-DD)"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={user.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      {[
        "interests",
        "aboutMe",
        "myFaith",
        "personality",
        "languages",
        "ethnicity",
      ].map((field) => (
        <View key={field} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          <View style={styles.optionsContainer}>
            {field === "interests" &&
              interestOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            {field === "aboutMe" &&
              aboutMeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            {field === "myFaith" &&
              myFaithOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            {field === "personality" &&
              personalityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            {field === "languages" &&
              languagesOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            {field === "ethnicity" &&
              ethnicityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    user[field].includes(option) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleArrayChange(field, option)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(user[field].includes(option) && {
                        color: colors.buttonText,
                      }),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={user.age}
        onChangeText={(text) => handleInputChange("age", text)}
        placeholder="Age"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={user.bio}
        onChangeText={(text) => handleInputChange("bio", text)}
        placeholder="Bio"
        multiline
      />
      <TextInput
        style={styles.input}
        value={user.education}
        onChangeText={(text) => handleInputChange("education", text)}
        placeholder="Education"
      />
      <TextInput
        style={styles.input}
        value={user.contactsFiltered.join(", ")}
        onChangeText={(text) =>
          handleInputChange("contactsFiltered", text.split(", "))
        }
        placeholder="Contacts Filtered (comma-separated)"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGalleryUpload()}
      >
        <Text style={styles.buttonText}>Upload Gallery Images</Text>
      </TouchableOpacity>
      {user.gallery.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>,
    {
      behavior: Platform.OS === "ios" ? "padding" : "height",
      keyboardVerticalOffset: Platform.OS === "ios" ? 120 : 100,
      style: { flex: 1, backgroundColor: colors.background },
    }
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, padding: 20 },
  contentContainer: { paddingBottom: 40 },
  title: { color: colors.textPrimary, fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: { height: 50 },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: colors.buttonText, fontSize: 16 },
  image: { width: 100, height: 100, marginBottom: 15 },
  section: { marginBottom: 20 },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, marginBottom: 10 },
  optionsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  option: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: { color: colors.textSecondary },
});

export default EditProfile;