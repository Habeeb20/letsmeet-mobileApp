
























// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   Image,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Platform,
// //   Alert,
// //   PermissionsAndroid,
// // } from "react-native";
// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import colors from "./../colors";
// // import { useRouter, useLocalSearchParams } from "expo-router";
// // import * as ImagePicker from "react-native-image-picker";
// // import axios from "axios";
// // import { submitProfile } from "../constants/api";
// // import Icon from "react-native-vector-icons/FontAwesome";

// // const Profile = ({ navigation }) => {
// //   const router = useRouter();
// //   const { email } = useLocalSearchParams(); // Retrieve email from route params
// //   console.log("Received email:", email); // Debug log for email
// //   const [firstName, setFirstName] = useState("John");
// //   const [lastName, setLastName] = useState("Doe");
// //   const [dateOfBirth, setDateOfBirth] = useState(new Date("1990-01-01"));
// //   const [profilePicture, setProfilePicture] = useState(
// //     "https://via.placeholder.com/150"
// //   );
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [youremail, setYouremail] = useState(email || "");

// //   // Request permissions for camera and storage
// //   useEffect(() => {
// //     const requestPermissions = async () => {
// //       if (Platform.OS !== "web") {
// //         try {
// //           const camera = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.CAMERA,
// //             {
// //               title: "Camera Permission",
// //               message: "This app needs camera access to take profile photos.",
// //               buttonNeutral: "Ask Me Later",
// //               buttonNegative: "Cancel",
// //               buttonPositive: "OK",
// //             }
// //           );
// //           const storage = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// //             {
// //               title: "Storage Permission",
// //               message: "This app needs storage access to pick profile photos.",
// //               buttonNeutral: "Ask Me Later",
// //               buttonNegative: "Cancel",
// //               buttonPositive: "OK",
// //             }
// //           );
// //           if (camera !== PermissionsAndroid.RESULTS.GRANTED) {
// //             console.log("Camera permission denied");
// //             Alert.alert("Permission Denied", "Camera access is required to take photos.");
// //           }
// //           if (storage !== PermissionsAndroid.RESULTS.GRANTED) {
// //             console.log("Storage permission denied");
// //             Alert.alert("Permission Denied", "Storage access is required to pick photos.");
// //           }
// //         } catch (err) {
// //           console.error("Permission request failed:", err);
// //         }
// //       }
// //     };
// //     requestPermissions();
// //   }, []);

// //   const onDateChange = (event, selectedDate) => {
// //     const currentDate = selectedDate || dateOfBirth;
// //     setShowDatePicker(Platform.OS === "ios");
// //     setDateOfBirth(currentDate);
// //   };

// //   const pickImage = async () => {
// //     if (Platform.OS === "web") {
// //       Alert.alert("Unsupported", "Image picking is not supported on web.");
// //       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       return;
// //     }
// //     try {
// //       const response = await ImagePicker.launchImageLibrary({
// //         mediaType: "photo",
// //         includeBase64: false,
// //         maxHeight: 200,
// //         maxWidth: 200,
// //       });
// //       if (response.didCancel) {
// //         console.log("User cancelled image picker");
// //         Alert.alert("Cancelled", "Image selection was cancelled.");
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       } else if (response.errorCode) {
// //         console.error("ImagePicker Error:", response.errorCode, response.errorMessage);
// //         Alert.alert("Error", `Failed to pick image: ${response.errorMessage || "Unknown error"}`);
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
// //         console.log("Selected image URI:", response.assets[0].uri);
// //         setProfilePicture(response.assets[0].uri);
// //       } else {
// //         console.error("No image selected or invalid response:", response);
// //         Alert.alert("Error", "No image was selected. Please try again.");
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       }
// //     } catch (error) {
// //       console.error("Image picker failed:", error);
// //       Alert.alert("Error", "An unexpected error occurred while picking the image.");
// //       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //     }
// //   };

// //   const takePhoto = async () => {
// //     if (Platform.OS === "web") {
// //       Alert.alert("Unsupported", "Camera is not supported on web.");
// //       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       return;
// //     }
// //     try {
// //       const response = await ImagePicker.launchCamera({
// //         mediaType: "photo",
// //         includeBase64: false,
// //         maxHeight: 200,
// //         maxWidth: 200,
// //       });
// //       if (response.didCancel) {
// //         console.log("User cancelled camera");
// //         Alert.alert("Cancelled", "Camera was cancelled.");
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       } else if (response.errorCode) {
// //         console.error("Camera Error:", response.errorCode, response.errorMessage);
// //         Alert.alert("Error", `Failed to take photo: ${response.errorMessage || "Unknown error"}`);
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
// //         console.log("Captured photo URI:", response.assets[0].uri);
// //         setProfilePicture(response.assets[0].uri);
// //       } else {
// //         console.error("No photo captured or invalid response:", response);
// //         Alert.alert("Error", "No photo was captured. Please try again.");
// //         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //       }
// //     } catch (error) {
// //       console.error("Camera failed:", error);
// //       Alert.alert("Error", "An unexpected error occurred while using the camera.");
// //       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
// //     }
// //   };

// //   const uploadImageToCloudinary = async (uri) => {
// //     console.log("Starting Cloudinary upload for URI:", uri);
// //     const data = new FormData();
// //     data.append("file", {
// //       uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
// //       type: "image/jpeg",
// //       name: "profile.jpg",
// //     });
// //     data.append("upload_preset", "essential");
// //     data.append("cloud_name", "dc0poqt9l");

// //     try {
// //       const response = await axios.post(
// //         "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
// //         data,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             "X-Requested-With": "XMLHttpRequest", // Helps with CORS
// //           },
// //         }
// //       );
// //       console.log("Cloudinary upload success:", response.data.secure_url);
// //       return response.data.secure_url;
// //     } catch (error) {
// //       console.error("Cloudinary upload failed:", {
// //         message: error.message,
// //         response: error.response?.data,
// //         status: error.response?.status,
// //       });
// //       Alert.alert("Upload Failed", "Could not upload image to Cloudinary. Please try again.");
// //       return null;
// //     }
// //   };

// //   const handleSave = async () => {
// //     let cloudinaryUrl = profilePicture;
// //     if (
// //       profilePicture.startsWith("file://") ||
// //       profilePicture.startsWith("content://")
// //     ) {
// //       console.log("Uploading local image to Cloudinary...");
// //       cloudinaryUrl = await uploadImageToCloudinary(profilePicture);
// //       if (!cloudinaryUrl) {
// //         console.log("Image upload failed, using placeholder");
// //         cloudinaryUrl = "https://via.placeholder.com/150";
// //         Alert.alert("Warning", "Image upload failed. Using placeholder image.");
// //       }
// //     }

// //     // Client-side validation
// //     if (
// //       !email ||
// //       !firstName.trim() ||
// //       !lastName.trim() ||
// //       !cloudinaryUrl ||
// //       !dateOfBirth
// //     ) {
// //       console.log("Validation failed: All profile fields are required. Data:", {
// //         email,
// //         firstName,
// //         lastName,
// //         cloudinaryUrl,
// //         dateOfBirth,
// //       });
// //       Alert.alert("Validation Error", "Please fill in all required fields.");
// //       return;
// //     }

// //     console.log("Sending data to backend:", {
// //       email,
// //       firstName,
// //       lastName,
// //       profilePicture: cloudinaryUrl,
// //       dateOfBirth: dateOfBirth.toISOString(),
// //       password: "defaultPassword",
// //     });
// //     try {
// //       const response = await submitProfile(
// //         email,
// //         firstName,
// //         lastName,
// //         cloudinaryUrl,
// //         dateOfBirth.toISOString(),
// //         "defaultPassword"
// //       );
// //       console.log("Profile saved successfully:", response.data);
// //       if (response.data.nextStep) {
// //         setTimeout(
// //           () =>
// //             router.push({
// //               pathname: `/${response.data.nextStep}`,
// //               params: { email },
// //             }),
// //           1500
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Profile save failed:", error.response?.data || error.message);
// //       Alert.alert("Save Failed", "Could not save profile. Please try again.");
// //     }
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       <View style={styles.gradient}>
// //         <View style={styles.content}>
// //           <Image
// //             source={require("../assets/images/datingLogo.jpeg")}
// //             style={styles.logo}
// //             resizeMode="contain"
// //           />
// //           <View style={styles.profilePictureContainer}>
// //             <Image
// //               source={{ uri: profilePicture }}
// //               style={styles.profilePicture}
// //               resizeMode="cover"
// //             />
// //             <TouchableOpacity
// //               style={styles.cameraIcon}
// //               onPress={() => {
// //                 Alert.alert("Select Image", "Choose an option", [
// //                   { text: "Pick from Gallery", onPress: pickImage },
// //                   { text: "Take Photo", onPress: takePhoto },
// //                   { text: "Cancel", style: "cancel" },
// //                 ]);
// //               }}
// //             >
// //               <Icon name="camera" size={24} color="#fff" />
// //             </TouchableOpacity>
// //           </View>
// //           <Text style={styles.title}>Profile Details</Text>
// //           <TextInput
// //             style={styles.input}
// //             value={firstName}
// //             onChangeText={setFirstName}
// //             placeholder="First Name"
// //             placeholderTextColor={colors.textSecondary}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             value={lastName}
// //             onChangeText={setLastName}
// //             placeholder="Last Name"
// //             placeholderTextColor={colors.textSecondary}
// //           />
// //           <TouchableOpacity
// //             style={styles.input}
// //             onPress={() => setShowDatePicker(true)}
// //           >
// //             <Text style={styles.inputText}>
// //               {dateOfBirth.toLocaleDateString("en-US")}
// //             </Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
// //             <Text style={styles.saveButtonText}>Save</Text>
// //           </TouchableOpacity>
// //           {showDatePicker && (
// //             <DateTimePicker
// //               testID="dateTimePicker"
// //               value={dateOfBirth}
// //               mode="date"
// //               display="calendar"
// //               onChange={onDateChange}
// //               maximumDate={new Date()}
// //               style={styles.datePicker}
// //               textColor="#000"
// //               accentColor="#FF0050"
// //               themeVariant="light"
// //             />
// //           )}
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   gradient: {
// //     flex: 1,
// //     ...(Platform.OS === "web" && {}),
// //     backgroundColor: "#fff", // Fallback for native
// //   },
// //   content: {
// //     alignItems: "center",
// //     padding: 20,
// //     paddingBottom: 40,
// //   },
// //   logo: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     marginBottom: 20,
// //     borderWidth: 2,
// //     borderColor: "#fff",
// //   },
// //   profilePictureContainer: {
// //     position: "relative",
// //     marginBottom: 30,
// //   },
// //   profilePicture: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     borderWidth: 4,
// //     borderColor: colors.primary,
// //     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
// //   },
// //   cameraIcon: {
// //     position: "absolute",
// //     bottom: 5,
// //     right: -10,
// //     backgroundColor: colors.primary,
// //     borderRadius: 15,
// //     padding: 5,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: "semibold",
// //     color: "#000033", // Corrected invalid hex color #003
// //     textAlign: "center",
// //     marginBottom: 30,
// //     textShadowColor: "#000",
// //     textShadowOffset: { width: 1, height: 1 },
// //     textShadowRadius: 2,
// //   },
// //   input: {
// //     width: "85%",
// //     height: 50,
// //     backgroundColor: "rgba(255, 255, 255, 0.9)",
// //     borderRadius: 25,
// //     paddingHorizontal: 20,
// //     marginBottom: 20,
// //     color: "#000",
// //     fontSize: 16,
// //     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
// //   },
// //   inputText: {
// //     color: "#000",
// //     fontSize: 16,
// //   },
// //   saveButton: {
// //     backgroundColor: colors.primary,
// //     paddingVertical: 15,
// //     paddingHorizontal: 50,
// //     borderRadius: 25,
// //     width: "80%",
// //     marginTop: 20,
// //     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
// //   },
// //   saveButtonText: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "600",
// //     textAlign: "center",
// //   },
// //   datePicker: {
// //     backgroundColor: "#fff",
// //     width: "85%",
// //     borderRadius: 15,
// //     marginTop: 10,
// //     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
// //   },
// // });

// // export default Profile;




import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Image,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { submitProfile } from "../constants/api";

const Profile = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date("2000-01-01"));
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadAnimRef = useRef(null);

  useEffect(() => {
    if (uploadingImage) uploadAnimRef.current?.play();
  }, [uploadingImage]);

  const checkGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photo library to upload images.");
      return false;
    }
    return true;
  };

  const checkCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access to take a profile photo.");
      return false;
    }
    return true;
  };

  const uploadImageToCloudinary = async (uri) => {
    setUploadingImage(true);
    const data = new FormData();
    data.append("file", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      type: "image/jpeg",
      name: "profile.jpg",
    });
    data.append("upload_preset", "essential");
    data.append("cloud_name", "dc0poqt9l");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error.response?.data || error.message);
      Alert.alert("Upload failed", "Could not upload your photo. Please try again.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const pickImage = async () => {
    setShowPhotoSheet(false);
    if (Platform.OS === "web") {
      Alert.alert("Unsupported", "Image picking is not supported on web.");
      return;
    }
    const hasPermission = await checkGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) return;

    const cloudinaryUrl = await uploadImageToCloudinary(result.assets[0].uri);
    if (cloudinaryUrl) setProfilePicture(cloudinaryUrl);
  };

  const takePhoto = async () => {
    setShowPhotoSheet(false);
    if (Platform.OS === "web") {
      Alert.alert("Unsupported", "Camera is not supported on web.");
      return;
    }
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) return;

    const cloudinaryUrl = await uploadImageToCloudinary(result.assets[0].uri);
    if (cloudinaryUrl) setProfilePicture(cloudinaryUrl);
  };

  const handleSave = async () => {
    if (!email || !firstName.trim() || !lastName.trim() || !profilePicture || !dateOfBirth) {
      Alert.alert("Missing details", "Please fill in all fields and add a profile photo.");
      return;
    }

    setSaving(true);
    try {
      const response = await submitProfile(
        email,
        firstName,
        lastName,
        profilePicture,
        dateOfBirth.toISOString(),
        "defaultPassword"
      );
      if (response.data.nextStep) {
        setTimeout(
          () => router.push({ pathname: `/${response.data.nextStep}`, params: { email } }),
          800
        );
      }
    } catch (error) {
      console.error("Profile save failed:", error.response?.data || error.message);
      Alert.alert("Save failed", "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topAccent} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>This is how you'll appear to others</Text>
        </View>

        {/* Profile picture */}
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} resizeMode="cover" />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={44} color="#D9A5A0" />
            </View>
          )}

          <TouchableOpacity style={styles.cameraBadgeShadow} onPress={() => setShowPhotoSheet(true)}>
            <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#C7807F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor="#B5A3A3"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#C7807F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor="#B5A3A3"
            />
          </View>

          <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#C7807F" style={styles.inputIcon} />
            <Text style={styles.inputText}>{dateOfBirth.toLocaleDateString("en-US")}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            style={styles.buttonShadow}
          >
            <LinearGradient
              colors={saving ? ["#D9B8B8", "#D9B8B8"] : ["#FF6B6B", "#FF3D77"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{saving ? "Saving…" : "Continue"}</Text>
              {!saving && <Ionicons name="arrow-forward" size={18} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Photo source action sheet */}
      <Modal transparent visible={showPhotoSheet} animationType="fade">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoSheet(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add a photo</Text>

            <TouchableOpacity style={styles.sheetOption} onPress={pickImage}>
              <View style={styles.sheetIconWrap}>
                <Ionicons name="images-outline" size={20} color="#FF3D77" />
              </View>
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={takePhoto}>
              <View style={styles.sheetIconWrap}>
                <Ionicons name="camera-outline" size={20} color="#FF3D77" />
              </View>
              <Text style={styles.sheetOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetCancel} onPress={() => setShowPhotoSheet(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Upload overlay with Lottie */}
      <Modal transparent visible={uploadingImage} animationType="fade">
        <View style={styles.uploadOverlay}>
          <View style={styles.uploadCard}>
            <LottieView
              ref={uploadAnimRef}
              // requires an actual Lottie JSON file — a simple "uploading/loading"
              // animation from lottiefiles.com works well here
              source={require("../assets/images/login orange.json")}
              autoPlay
              loop
              style={styles.uploadAnimation}
            />
            <Text style={styles.uploadText}>Uploading your photo…</Text>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#FFE4E1",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D2C2E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A7373",
    marginTop: 4,
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 32,
  },
  profilePicture: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#3D2C2E",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  profilePlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#F3E4E2",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadgeShadow: {
    position: "absolute",
    bottom: 2,
    right: 2,
    borderRadius: 18,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cameraBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFF8F5",
  },
  form: {
    width: "100%",
    gap: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  inputText: {
    fontSize: 15,
    color: "#3D2C2E",
  },
  buttonShadow: {
    marginTop: 8,
    borderRadius: 999,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(61,44,46,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF8F5",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    alignItems: "center",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5D5D2",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D2C2E",
    marginBottom: 16,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3E4E2",
  },
  sheetIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFE4E1",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D2C2E",
  },
  sheetCancel: {
    marginTop: 4,
    paddingVertical: 12,
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A7373",
  },
  uploadOverlay: {
    flex: 1,
    backgroundColor: "rgba(61,44,46,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  uploadAnimation: {
    width: 100,
    height: 100,
  },
  uploadText: {
    fontSize: 13,
    color: "#8A7373",
    marginTop: 8,
  },
});

export default Profile;