
import React, { useState, useEffect } from "react";
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
import colors from "./../colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { submitProfile } from "../constants/api";
import Icon from "react-native-vector-icons/FontAwesome";
import { PermissionsAndroid } from "react-native";

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
  const [youremail, setYouremail] = useState(email || "");

  // Request camera permissions only
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== "web") {
        try {
          const camera = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "This app needs camera access to take profile photos.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (camera !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission denied");
            Alert.alert("Permission Denied", "Camera access is required to take photos.");
          }
        } catch (err) {
          console.error("Permission request failed:", err);
        }
      }
    };
    requestPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your photo library to upload images.");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Unsupported", "Image picking is not supported on web.");
      setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      return;
    }
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use enum to avoid type error
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile picture
      });

      if (!result || result.canceled) {
        console.log("User cancelled image picker");
        Alert.alert("Cancelled", "Image selection was cancelled.");
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.error("No image data returned from picker.");
        Alert.alert("Error", "No image was selected. Please try again.");
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
        return;
      }

      const file = result.assets[0];
      console.log("Selected image URI:", file.uri);
      const cloudinaryUrl = await uploadImageToCloudinary(file.uri);
      if (cloudinaryUrl) {
        setProfilePicture(cloudinaryUrl);
      } else {
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      }
    } catch (error) {
      console.error("Image picker failed:", error);
      Alert.alert("Error", "An unexpected error occurred while picking the image.");
      setProfilePicture("https://via.placeholder.com/150"); // Fallback image
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Unsupported", "Camera is not supported on web.");
      setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      return;
    }
    try {
      const response = await ImagePicker.launchCamera({
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      });
      if (response.didCancel) {
        console.log("User cancelled camera");
        Alert.alert("Cancelled", "Camera was cancelled.");
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      } else if (response.errorCode) {
        console.error("Camera Error:", response.errorCode, response.errorMessage);
        Alert.alert("Error", `Failed to take photo: ${response.errorMessage || "Unknown error"}`);
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        console.log("Captured photo URI:", response.assets[0].uri);
        setProfilePicture(response.assets[0].uri);
      } else {
        console.error("No photo captured or invalid response:", response);
        Alert.alert("Error", "No photo was captured. Please try again.");
        setProfilePicture("https://via.placeholder.com/150"); // Fallback image
      }
    } catch (error) {
      console.error("Camera failed:", error);
      Alert.alert("Error", "An unexpected error occurred while using the camera.");
      setProfilePicture("https://via.placeholder.com/150"); // Fallback image
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    console.log("Starting Cloudinary upload for URI:", uri);
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
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest", // Helps with CORS
          },
        }
      );
      console.log("Cloudinary upload success:", response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert("Upload Failed", "Could not upload image to Cloudinary. Please try again.");
      return null;
    }
  };

  const handleSave = async () => {
    let cloudinaryUrl = profilePicture;
    if (
      profilePicture.startsWith("file://") ||
      profilePicture.startsWith("content://")
    ) {
      console.log("Uploading local image to Cloudinary...");
      cloudinaryUrl = await uploadImageToCloudinary(profilePicture);
      if (!cloudinaryUrl) {
        console.log("Image upload failed, using placeholder");
        cloudinaryUrl = "https://via.placeholder.com/150";
        Alert.alert("Warning", "Image upload failed. Using placeholder image.");
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
      Alert.alert("Validation Error", "Please fill in all required fields.");
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
      console.error("Profile save failed:", error.response?.data || error.message);
      Alert.alert("Save Failed", "Could not save profile. Please try again.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
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
                  { text: "Cancel", style: "cancel" },
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
    color: "#000033", // Corrected invalid hex color #003
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








































// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   Alert,
//   PermissionsAndroid,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import colors from "./../colors";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import * as ImagePicker from "react-native-image-picker";
// import axios from "axios";
// import { submitProfile } from "../constants/api";
// import Icon from "react-native-vector-icons/FontAwesome";

// const Profile = ({ navigation }) => {
//   const router = useRouter();
//   const { email } = useLocalSearchParams(); // Retrieve email from route params
//   console.log("Received email:", email); // Debug log for email
//   const [firstName, setFirstName] = useState("John");
//   const [lastName, setLastName] = useState("Doe");
//   const [dateOfBirth, setDateOfBirth] = useState(new Date("1990-01-01"));
//   const [profilePicture, setProfilePicture] = useState(
//     "https://via.placeholder.com/150"
//   );
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [youremail, setYouremail] = useState(email || "");

//   // Request permissions for camera and storage
//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (Platform.OS !== "web") {
//         try {
//           const camera = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: "Camera Permission",
//               message: "This app needs camera access to take profile photos.",
//               buttonNeutral: "Ask Me Later",
//               buttonNegative: "Cancel",
//               buttonPositive: "OK",
//             }
//           );
//           const storage = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//             {
//               title: "Storage Permission",
//               message: "This app needs storage access to pick profile photos.",
//               buttonNeutral: "Ask Me Later",
//               buttonNegative: "Cancel",
//               buttonPositive: "OK",
//             }
//           );
//           if (camera !== PermissionsAndroid.RESULTS.GRANTED) {
//             console.log("Camera permission denied");
//             Alert.alert("Permission Denied", "Camera access is required to take photos.");
//           }
//           if (storage !== PermissionsAndroid.RESULTS.GRANTED) {
//             console.log("Storage permission denied");
//             Alert.alert("Permission Denied", "Storage access is required to pick photos.");
//           }
//         } catch (err) {
//           console.error("Permission request failed:", err);
//         }
//       }
//     };
//     requestPermissions();
//   }, []);

//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || dateOfBirth;
//     setShowDatePicker(Platform.OS === "ios");
//     setDateOfBirth(currentDate);
//   };

//   const pickImage = async () => {
//     if (Platform.OS === "web") {
//       Alert.alert("Unsupported", "Image picking is not supported on web.");
//       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       return;
//     }
//     try {
//       const response = await ImagePicker.launchImageLibrary({
//         mediaType: "photo",
//         includeBase64: false,
//         maxHeight: 200,
//         maxWidth: 200,
//       });
//       if (response.didCancel) {
//         console.log("User cancelled image picker");
//         Alert.alert("Cancelled", "Image selection was cancelled.");
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       } else if (response.errorCode) {
//         console.error("ImagePicker Error:", response.errorCode, response.errorMessage);
//         Alert.alert("Error", `Failed to pick image: ${response.errorMessage || "Unknown error"}`);
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
//         console.log("Selected image URI:", response.assets[0].uri);
//         setProfilePicture(response.assets[0].uri);
//       } else {
//         console.error("No image selected or invalid response:", response);
//         Alert.alert("Error", "No image was selected. Please try again.");
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       }
//     } catch (error) {
//       console.error("Image picker failed:", error);
//       Alert.alert("Error", "An unexpected error occurred while picking the image.");
//       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//     }
//   };

//   const takePhoto = async () => {
//     if (Platform.OS === "web") {
//       Alert.alert("Unsupported", "Camera is not supported on web.");
//       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       return;
//     }
//     try {
//       const response = await ImagePicker.launchCamera({
//         mediaType: "photo",
//         includeBase64: false,
//         maxHeight: 200,
//         maxWidth: 200,
//       });
//       if (response.didCancel) {
//         console.log("User cancelled camera");
//         Alert.alert("Cancelled", "Camera was cancelled.");
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       } else if (response.errorCode) {
//         console.error("Camera Error:", response.errorCode, response.errorMessage);
//         Alert.alert("Error", `Failed to take photo: ${response.errorMessage || "Unknown error"}`);
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
//         console.log("Captured photo URI:", response.assets[0].uri);
//         setProfilePicture(response.assets[0].uri);
//       } else {
//         console.error("No photo captured or invalid response:", response);
//         Alert.alert("Error", "No photo was captured. Please try again.");
//         setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//       }
//     } catch (error) {
//       console.error("Camera failed:", error);
//       Alert.alert("Error", "An unexpected error occurred while using the camera.");
//       setProfilePicture("https://via.placeholder.com/150"); // Fallback image
//     }
//   };

//   const uploadImageToCloudinary = async (uri) => {
//     console.log("Starting Cloudinary upload for URI:", uri);
//     const data = new FormData();
//     data.append("file", {
//       uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
//       type: "image/jpeg",
//       name: "profile.jpg",
//     });
//     data.append("upload_preset", "essential");
//     data.append("cloud_name", "dc0poqt9l");

//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "X-Requested-With": "XMLHttpRequest", // Helps with CORS
//           },
//         }
//       );
//       console.log("Cloudinary upload success:", response.data.secure_url);
//       return response.data.secure_url;
//     } catch (error) {
//       console.error("Cloudinary upload failed:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       Alert.alert("Upload Failed", "Could not upload image to Cloudinary. Please try again.");
//       return null;
//     }
//   };

//   const handleSave = async () => {
//     let cloudinaryUrl = profilePicture;
//     if (
//       profilePicture.startsWith("file://") ||
//       profilePicture.startsWith("content://")
//     ) {
//       console.log("Uploading local image to Cloudinary...");
//       cloudinaryUrl = await uploadImageToCloudinary(profilePicture);
//       if (!cloudinaryUrl) {
//         console.log("Image upload failed, using placeholder");
//         cloudinaryUrl = "https://via.placeholder.com/150";
//         Alert.alert("Warning", "Image upload failed. Using placeholder image.");
//       }
//     }

//     // Client-side validation
//     if (
//       !email ||
//       !firstName.trim() ||
//       !lastName.trim() ||
//       !cloudinaryUrl ||
//       !dateOfBirth
//     ) {
//       console.log("Validation failed: All profile fields are required. Data:", {
//         email,
//         firstName,
//         lastName,
//         cloudinaryUrl,
//         dateOfBirth,
//       });
//       Alert.alert("Validation Error", "Please fill in all required fields.");
//       return;
//     }

//     console.log("Sending data to backend:", {
//       email,
//       firstName,
//       lastName,
//       profilePicture: cloudinaryUrl,
//       dateOfBirth: dateOfBirth.toISOString(),
//       password: "defaultPassword",
//     });
//     try {
//       const response = await submitProfile(
//         email,
//         firstName,
//         lastName,
//         cloudinaryUrl,
//         dateOfBirth.toISOString(),
//         "defaultPassword"
//       );
//       console.log("Profile saved successfully:", response.data);
//       if (response.data.nextStep) {
//         setTimeout(
//           () =>
//             router.push({
//               pathname: `/${response.data.nextStep}`,
//               params: { email },
//             }),
//           1500
//         );
//       }
//     } catch (error) {
//       console.error("Profile save failed:", error.response?.data || error.message);
//       Alert.alert("Save Failed", "Could not save profile. Please try again.");
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.gradient}>
//         <View style={styles.content}>
//           <Image
//             source={require("../assets/images/datingLogo.jpeg")}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//           <View style={styles.profilePictureContainer}>
//             <Image
//               source={{ uri: profilePicture }}
//               style={styles.profilePicture}
//               resizeMode="cover"
//             />
//             <TouchableOpacity
//               style={styles.cameraIcon}
//               onPress={() => {
//                 Alert.alert("Select Image", "Choose an option", [
//                   { text: "Pick from Gallery", onPress: pickImage },
//                   { text: "Take Photo", onPress: takePhoto },
//                   { text: "Cancel", style: "cancel" },
//                 ]);
//               }}
//             >
//               <Icon name="camera" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.title}>Profile Details</Text>
//           <TextInput
//             style={styles.input}
//             value={firstName}
//             onChangeText={setFirstName}
//             placeholder="First Name"
//             placeholderTextColor={colors.textSecondary}
//           />
//           <TextInput
//             style={styles.input}
//             value={lastName}
//             onChangeText={setLastName}
//             placeholder="Last Name"
//             placeholderTextColor={colors.textSecondary}
//           />
//           <TouchableOpacity
//             style={styles.input}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text style={styles.inputText}>
//               {dateOfBirth.toLocaleDateString("en-US")}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//             <Text style={styles.saveButtonText}>Save</Text>
//           </TouchableOpacity>
//           {showDatePicker && (
//             <DateTimePicker
//               testID="dateTimePicker"
//               value={dateOfBirth}
//               mode="date"
//               display="calendar"
//               onChange={onDateChange}
//               maximumDate={new Date()}
//               style={styles.datePicker}
//               textColor="#000"
//               accentColor="#FF0050"
//               themeVariant="light"
//             />
//           )}
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
//     ...(Platform.OS === "web" && {}),
//     backgroundColor: "#fff", // Fallback for native
//   },
//   content: {
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 40,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   profilePictureContainer: {
//     position: "relative",
//     marginBottom: 30,
//   },
//   profilePicture: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: colors.primary,
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//   },
//   cameraIcon: {
//     position: "absolute",
//     bottom: 5,
//     right: -10,
//     backgroundColor: colors.primary,
//     borderRadius: 15,
//     padding: 5,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "semibold",
//     color: "#000033", // Corrected invalid hex color #003
//     textAlign: "center",
//     marginBottom: 30,
//     textShadowColor: "#000",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   input: {
//     width: "85%",
//     height: 50,
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     borderRadius: 25,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//     color: "#000",
//     fontSize: 16,
//     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
//   },
//   inputText: {
//     color: "#000",
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 50,
//     borderRadius: 25,
//     width: "80%",
//     marginTop: 20,
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   datePicker: {
//     backgroundColor: "#fff",
//     width: "85%",
//     borderRadius: 15,
//     marginTop: 10,
//     boxShadow: "0 2px 3px rgba(0, 0, 0, 0.2)",
//   },
// });

// export default Profile;