// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import Footer from "./others/Footer";
// import colors from "./../colors";
// import LoveLoader from "./others/LoveLoader";
// import { updateProfile, fetchProfile } from "../constants/api";
// import { withKeyboardAvoiding } from "./utils/keyboardAvoiding";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
// import api from "../constants/api";
// const EditProfile = () => {
//   const router = useRouter();
//   const [user, setUser] = useState({
//     email: "",
//     phoneNumber: "",
//     firstName: "",
//     lastName: "",
//     profilePicture: "",
//     dateOfBirth: "",
//     gender: "",
//     interests: [],
//     aboutMe: [],
//     myFaith: [],
//     personality: [],
//     languages: [],
//     ethnicity: [],
//     age: "",
//     bio: "",
//     education: "",
//     contactsFiltered: [],
//     notificationsEnabled: false,
//     gallery: [],
//   });
//   const [loading, setLoading] = useState(false);

//   // Fetch user data to prefill
//   useEffect(() => {
//     const loadUserData = async () => {
//       setLoading(true);
//       try {
//         const token = await AsyncStorage.getItem("authToken");
//         if (!token) {
//           router.push("/signin");
//           console.log("failed to get the token")
//           return;
//         }
//         const response = await api.get("/api/auth/dashboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Failed to fetch user data", error);
//         router.push("/signin");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUserData();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleArrayChange = (field, value) => {
//     setUser((prev) => {
//       const current = prev[field];
//       return {
//         ...prev,
//         [field]: current.includes(value)
//           ? current.filter((item) => item !== value)
//           : [...current, value],
//       };
//     });
//   };

//   const handleImageUpload = async (field) => {
//     setLoading(true);
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });
//       if (!result.canceled) {
//         const file = result?.assets[0];
//         const data = new FormData();
//         data.append("file", {
//           uri: file?.uri,
//           type: file.type || "image/jpeg",
//           name: file.fileName || "image.jpg",
//         });
//         data.append("upload_preset", "your_upload_preset");
//         data.append("api_key", "your_api_key");
//         data.append("timestamp", (Date.now() / 1000) | 0);

//         const res = await fetch(
//           "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
//           { method: "POST", body: data }
//         );
//         const result = await res.json();
//         setUser((prev) => ({ ...prev, [field]: result.secure_url }));
//       }
//     } catch (error) {
//       console.error("Image upload failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGalleryUpload = async () => {
//     setLoading(true);
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//       });
//       if (!result.canceled) {
//         const uploadPromises = result.assets.map((file) => {
//           const data = new FormData();
//           data.append("file", {
//             uri: file.uri,
//             type: file.type || "image/jpeg",
//             name: file.fileName || "image.jpg",
//           });
//           data.append("upload_preset", " essential");
//           data.append("api_key", "624216876378923");
//           data.append("timestamp", (Date.now() / 1000) | 0);
//           return fetch(
//             "https://api.cloudinary.com/v1_1/dc0poqt9l/image/upload",
//             { method: "POST", body: data }
//           ).then((res) => res.json());
//         });
//         const responses = await Promise.all(uploadPromises);
//         const urls = responses.map((res) => res.secure_url);
//         setUser((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
//       }
//     } catch (error) {
//       console.error("Gallery upload failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("authToken");
//       if (!token) {
//         router.push("/signin");
//         return;
//       }
//       const response = await updateProfile(user, token);
//       console.log("Profile updated", response.data);
//     } catch (error) {
//       console.error("Update failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const interestOptions = [
//     "Photography",
//     "Shopping",
//     "Karaoke",
//     "Yoga",
//     "Cooking",
//     "Tennis",
//     "Run",
//     "Swimming",
//     "Art",
//     "Traveling",
//     "Extreme",
//     "Music",
//     "Drink",
//     "Video games",
//   ];
//   const aboutMeOptions = [
//     "Adventurous",
//     "Creative",
//     "Funny",
//     "Kind",
//     "Outgoing",
//   ];
//   const myFaithOptions = [
//     "Christianity",
//     "Islam",
//     "Buddhism",
//     "Hinduism",
//     "Other",
//   ];
//   const personalityOptions = [
//     "Introvert",
//     "Extrovert",
//     "Ambitious",
//     "Calm",
//     "Optimistic",
//   ];
//   const languagesOptions = [
//     "English",
//     "Spanish",
//     "French",
//     "Arabic",
//     "Swahili",
//   ];
//   const ethnicityOptions = [
//     "African",
//     "Asian",
//     "Caucasian",
//     "Hispanic",
//     "Mixed",
//   ];

//   return withKeyboardAvoiding(
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}
//     >
//       {loading && <LoveLoader />}
//       <Text style={styles.title}>Edit Profile</Text>
//       <TextInput
//         style={styles.input}
//         value={user.email}
//         onChangeText={(text) => handleInputChange("email", text)}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         value={user.phoneNumber}
//         onChangeText={(text) => handleInputChange("phoneNumber", text)}
//         placeholder="Phone Number"
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         style={styles.input}
//         value={user.firstName}
//         onChangeText={(text) => handleInputChange("firstName", text)}
//         placeholder="First Name"
//       />
//       <TextInput
//         style={styles.input}
//         value={user.lastName}
//         onChangeText={(text) => handleInputChange("lastName", text)}
//         placeholder="Last Name"
//       />
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => handleImageUpload("profilePicture")}
//       >
//         <Text style={styles.buttonText}>Upload Profile Picture</Text>
//       </TouchableOpacity>
//       {user.profilePicture && (
//         <Image source={{ uri: user.profilePicture }} style={styles.image} />
//       )}
//       <TextInput
//         style={styles.input}
//         value={user.dateOfBirth}
//         onChangeText={(text) => handleInputChange("dateOfBirth", text)}
//         placeholder="Date of Birth (YYYY-MM-DD)"
//       />
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={user.gender}
//           onValueChange={(value) => handleInputChange("gender", value)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Gender" value="" />
//           <Picker.Item label="Male" value="male" />
//           <Picker.Item label="Female" value="female" />
//           <Picker.Item label="Other" value="other" />
//         </Picker>
//       </View>
//       {[
//         "interests",
//         "aboutMe",
//         "myFaith",
//         "personality",
//         "languages",
//         "ethnicity",
//       ].map((field) => (
//         <View key={field} style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             {field.charAt(0).toUpperCase() + field.slice(1)}
//           </Text>
//           <View style={styles.optionsContainer}>
//             {field === "interests" &&
//               interestOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             {field === "aboutMe" &&
//               aboutMeOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             {field === "myFaith" &&
//               myFaithOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             {field === "personality" &&
//               personalityOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             {field === "languages" &&
//               languagesOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             {field === "ethnicity" &&
//               ethnicityOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.option,
//                     user[field].includes(option) && {
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                   onPress={() => handleArrayChange(field, option)}
//                 >
//                   <Text
//                     style={{
//                       ...styles.optionText,
//                       ...(user[field].includes(option) && {
//                         color: colors.buttonText,
//                       }),
//                     }}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//           </View>
//         </View>
//       ))}
//       <TextInput
//         style={styles.input}
//         value={user.age}
//         onChangeText={(text) => handleInputChange("age", text)}
//         placeholder="Age"
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         value={user.bio}
//         onChangeText={(text) => handleInputChange("bio", text)}
//         placeholder="Bio"
//         multiline
//       />
//       <TextInput
//         style={styles.input}
//         value={user.education}
//         onChangeText={(text) => handleInputChange("education", text)}
//         placeholder="Education"
//       />
//       <TextInput
//         style={styles.input}
//         value={user.contactsFiltered.join(", ")}
//         onChangeText={(text) =>
//           handleInputChange("contactsFiltered", text.split(", "))
//         }
//         placeholder="Contacts Filtered (comma-separated)"
//       />
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => handleGalleryUpload()}
//       >
//         <Text style={styles.buttonText}>Upload Gallery Images</Text>
//       </TouchableOpacity>
//       {user.gallery.map((url, index) => (
//         <Image key={index} source={{ uri: url }} style={styles.image} />
//       ))}
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </ScrollView>,
//     {
//       behavior: Platform.OS === "ios" ? "padding" : "height",
//       keyboardVerticalOffset: Platform.OS === "ios" ? 120 : 100,
//       style: { flex: 1, backgroundColor: colors.background },
//     }
//   );
// };

// const styles = StyleSheet.create({
//   container: { backgroundColor: colors.background, padding: 20 },
//   contentContainer: { paddingBottom: 40 },
//   title: { color: colors.textPrimary, fontSize: 24, marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.primary,
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   picker: { height: 50 },
//   button: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   buttonText: { color: colors.buttonText, fontSize: 16 },
//   image: { width: 100, height: 100, marginBottom: 15 },
//   section: { marginBottom: 20 },
//   sectionTitle: { color: colors.textPrimary, fontSize: 18, marginBottom: 10 },
//   optionsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
//   option: {
//     backgroundColor: colors.secondary,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   optionText: { color: colors.textSecondary },
// });

// export default EditProfile;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  Dimensions, // Added Dimensions import
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Footer from './others/Footer';
import colors from '../colors';
import LoveLoader from './others/LoveLoader';
import { updateProfile, fetchProfile } from '../constants/api';
import { withKeyboardAvoiding } from './utils/keyboardAvoiding';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../constants/api';
// Replace with your actual Cloudinary credentials or use environment variables
const CLOUDINARY_UPLOAD_PRESET = 'essential';
const CLOUDINARY_API_KEY = '624216876378923';
const CLOUDINARY_CLOUD_NAME = 'dc0poqt9l';

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: '',
    interests: [],
    aboutMe: [],
    myFaith: [],
    personality: [],
    languages: [],
    ethnicity: [],
    age: '',
    bio: '',
    education: '',
    contactsFiltered: [],
    notificationsEnabled: false,
    gallery: [],
  });
  const [loading, setLoading] = useState(false);

  // Request media library permissions
  // useEffect(() => {
  //   const requestPermissions = async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission Denied', 'Please allow access to your photo library to upload images.');
  //     }
  //   };
  //   requestPermissions();
  // }, []);

  // Fetch user data to prefill
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          router.push('/signin');
          console.log('Failed to get the token');
          return;
        }
        const response = await api.get('/api/auth/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        router.push('/signin');
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

  // const handleImageUpload = async (field) => {
  //   setLoading(true);
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 0.8,
  //       allowsEditing: true,
  //       aspect: [1, 1], // Square aspect ratio for profile picture
  //     });
  //     if (!result.canceled) {
  //       const file = result.assets[0];
  //       const formData = new FormData();
  //       formData.append('file', {
  //         uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  //         type: file.mimeType || 'image/jpeg',
  //         name: file.fileName || `profile-${Date.now()}.jpg`,
  //       });
  //       formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  //       formData.append('api_key', CLOUDINARY_API_KEY);
  //       formData.append('timestamp', Math.round(Date.now() / 1000));

  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  //         {
  //           method: 'POST',
  //           body: formData,
  //           headers: { 'Content-Type': 'multipart/form-data' },
  //         }
  //       );
  //       const result = await res.json();
  //       if (result.error) {
  //         throw new Error(result.error.message);
  //       }
  //       setUser((prev) => ({ ...prev, [field]: result.secure_url }));
  //     }
  //   } catch (error) {
  //     console.error('Image upload failed:', error);
  //     Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGalleryUpload = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsMultipleSelection: true,
  //       quality: 0.8,
  //     });
  //     if (!result.canceled) {
  //       const uploadPromises = result.assets.map((file) => {
  //         const formData = new FormData();
  //         formData.append('file', {
  //           uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  //           type: file.mimeType || 'image/jpeg',
  //           name: file.fileName || `gallery-${Date.now()}.jpg`,
  //         });
  //         formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  //         formData.append('api_key', CLOUDINARY_API_KEY);
  //         formData.append('timestamp', Math.round(Date.now() / 1000));
  //         return fetch(
  //           `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  //           {
  //             method: 'POST',
  //             body: formData,
  //             headers: { 'Content-Type': 'multipart/form-data' },
  //           }
  //         ).then((res) => res.json());
  //       });
  //       const responses = await Promise.all(uploadPromises);
  //       const urls = responses
  //         .filter((res) => !res.error)
  //         .map((res) => res.secure_url);
  //       if (responses.some((res) => res.error)) {
  //         Alert.alert('Partial Upload Failure', 'Some images failed to upload. Please try again.');
  //       }
  //       setUser((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
  //     }
  //   } catch (error) {
  //     console.error('Gallery upload failed:', error);
  //     Alert.alert('Upload Failed', 'Failed to upload gallery images. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Add this new function before handleImageUpload
const checkPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Please allow access to your photo library to upload images.');
    return false;
  }
  return true;
};

const handleImageUpload = async (field) => {
  setLoading(true);
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Revert to enum to fix type error
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile picture
    });

    if (!result || result.canceled) {
      Alert.alert('No Image Selected', 'Image selection was canceled.');
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      throw new Error('No image data returned from picker.');
    }

    const file = result.assets[0];
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
      type: file.mimeType || 'image/jpeg',
      name: file.fileName || `profile-${Date.now()}.jpg`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', Math.round(Date.now() / 1000));

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    const resultData = await res.json();
    if (resultData.error) {
      throw new Error(resultData.error.message);
    }
    setUser((prev) => ({ ...prev, [field]: resultData.secure_url }));
  } catch (error) {
    console.error('Image upload failed:', error);
    Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleGalleryUpload = async () => {
  setLoading(true);
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Revert to enum to fix type error
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result || result.canceled) {
      Alert.alert('No Images Selected', 'Image selection was canceled.');
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      throw new Error('No image data returned from picker.');
    }

    const uploadPromises = result.assets.map((file) => {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.fileName || `gallery-${Date.now()}.jpg`,
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('timestamp', Math.round(Date.now() / 1000));
      return fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      ).then((res) => res.json());
    });

    const responses = await Promise.all(uploadPromises);
    const urls = responses
      .filter((res) => !res.error)
      .map((res) => res.secure_url);
    if (responses.some((res) => res.error)) {
      Alert.alert('Partial Upload Failure', 'Some images failed to upload. Please try again.');
    }
    setUser((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
  } catch (error) {
    console.error('Gallery upload failed:', error);
    Alert.alert('Upload Failed', 'Failed to upload gallery images. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.push('/signin');
        return;
      }
      const response = await updateProfile(user, token);
      console.log('Profile updated:', response.data);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = [
    'Photography',
    'Shopping',
    'Karaoke',
    'Yoga',
    'Cooking',
    'Tennis',
    'Running',
    'Swimming',
    'Art',
    'Traveling',
    'Extreme Sports',
    'Music',
    'Dancing',
    'Video Games',
    'Reading',
    'Hiking',
    'Camping',
    'Fitness',
    'Movies',
    'Foodie',
    'Writing',
    'Gardening',
    'Skiing',
    'Surfing',
    'Board Games',
  ];
  const aboutMeOptions = [
    'Adventurous',
    'Creative',
    'Funny',
    'Kind',
    'Outgoing',
    'Thoughtful',
    'Ambitious',
    'Easygoing',
    'Romantic',
    'Intellectual',
    'Spontaneous',
    'Loyal',
    'Empathetic',
    'Curious',
    'Optimistic',
  ];
  const myFaithOptions = [
    'Christianity',
    'Islam',
    'Buddhism',
    'Hinduism',
    'Judaism',
    'Sikhism',
    'Atheism',
    'Agnosticism',
    'Spiritual',
    'Other',
  ];
  const personalityOptions = [
    'Introvert',
    'Extrovert',
    'Ambitious',
    'Calm',
    'Optimistic',
    'Analytical',
    'Creative',
    'Adventurous',
    'Organized',
    'Spontaneous',
    'Empathetic',
    'Confident',
    'Humorous',
    'Relaxed',
    'Driven',
  ];
  const languagesOptions = [
    'English',
    'Spanish',
    'French',
    'Arabic',
    'Swahili',
    'Mandarin',
    'Hindi',
    'Portuguese',
    'Russian',
    'German',
    'Japanese',
    'Korean',
    'Italian',
    'Yoruba',
    'Igbo',
    'Hausa',
    'Bengali',
    'Urdu',
    'Dutch',
    'Thai',
  ];
  const ethnicityOptions = [
    'African',
    'Asian',
    'Caucasian',
    'Hispanic',
    'Mixed',
    'Native American',
    'Middle Eastern',
    'South Asian',
    'Pacific Islander',
    'Caribbean',
    'Latino',
    'Indigenous',
    'Other',
  ];

  return withKeyboardAvoiding(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading && <LoveLoader />}
        <LinearGradient
          colors={['#E59898FF', '#FF6A53FF']}
          style={styles.headerContainer}
        >
          <Text style={styles.title}>Edit Your Profile</Text>
        </LinearGradient>
        <Animated.View entering={FadeInUp.duration(500)}>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={user.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            placeholder="Phone Number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={user.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            placeholder="First Name"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            value={user.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            placeholder="Last Name"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImageUpload('profilePicture')}
          >
            <Text style={styles.buttonText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {user.profilePicture && (
            <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          )}
          <TextInput
            style={styles.input}
            value={user.dateOfBirth}
            onChangeText={(text) => handleInputChange('dateOfBirth', text)}
            placeholder="Date of Birth (YYYY-MM-DD)"
            placeholderTextColor={colors.textSecondary}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={user.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            value={user.age}
            onChangeText={(text) => handleInputChange('age', text)}
            placeholder="Age"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={user.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            placeholder="Bio"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            value={user.education}
            onChangeText={(text) => handleInputChange('education', text)}
            placeholder="Education"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            value={user.contactsFiltered.join(', ')}
            onChangeText={(text) => handleInputChange('contactsFiltered', text.split(', '))}
            placeholder="Contacts Filtered (comma-separated)"
            placeholderTextColor={colors.textSecondary}
          />
        </Animated.View>
        {[
          { field: 'interests', options: interestOptions, gradient: ['#4ECDC4', '#45B7D1'] },
          { field: 'aboutMe', options: aboutMeOptions, gradient: ['#B2C3C2FF', '#8B998FFF'] },
          { field: 'myFaith', options: myFaithOptions, gradient: ['#7A736AFF', '#928583FF'] },
          { field: 'personality', options: personalityOptions, gradient: ['#6B7280', '#9CA3AF'] },
          { field: 'languages', options: languagesOptions, gradient: ['#B8A5AFFF', '#AC95A2FF'] },
          { field: 'ethnicity', options: ethnicityOptions, gradient: ['#60A5FA', '#3B82F6'] },
        ].map(({ field, options, gradient }) => (
          <Animated.View entering={FadeInUp.duration(500)} key={field} style={styles.section}>
            <LinearGradient colors={gradient} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <FlatList
                data={options}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      user[field].includes(item) && {
                        backgroundColor: colors.primary,
                        shadowOpacity: 0.4,
                      },
                    ]}
                    onPress={() => handleArrayChange(field, item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        user[field].includes(item) && { color: colors.buttonText },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </LinearGradient>
          </Animated.View>
        ))}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
          <LinearGradient colors={['#CF435AFF', '#DE7B7BFF']} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <TouchableOpacity style={styles.button} onPress={handleGalleryUpload}>
              <Text style={styles.buttonText}>Upload Gallery Images</Text>
            </TouchableOpacity>
            {user.gallery.length > 0 && (
              <FlatList
                data={user.gallery}
                numColumns={2}
                keyExtractor={(item, index) => `gallery-${index}`}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                )}
              />
            )}
          </LinearGradient>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(500)}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.footerSpacer} />
      </ScrollView>
      <Footer style={styles.footer} />
    </View>,
    {
      behavior: Platform.OS === 'ios' ? 'padding' : 'height',
      keyboardVerticalOffset: Platform.OS === 'ios' ? 120 : 100,
      style: { flex: 1, backgroundColor: colors.background },
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
       marginTop:20
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
 
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#FF4D4D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  galleryImage: {
    width: (Dimensions.get('window').width - 50) / 2,
    height: 150,
    borderRadius: 12,
    margin: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionContainer: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  footerSpacer: {
    height: 80,
  },
});

export default EditProfile;
