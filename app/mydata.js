// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import AsyncStorage from "@react-native-async-storage/async-storage";



// import { useRouter } from "expo-router";
// import Footer from "./others/Footer"
// import colors from "./../colors"
// import LoveLoader from "./others/LoveLoader";
// import api from "../constants/api";
// const Profile = () => {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = await AsyncStorage.getItem("authToken");
//         if (!token) {
//           router.push("/signin");
//           return;
//         }
//         console.log(token)
//         const response = await api.get("/api/auth/dashboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200) {
//           setUser(response.data);
//         } else {
//           setError(response.data.message || "Failed to fetch user data");
//           router.replace("/signin");
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             "An error occurred while fetching user data"
//         );
//         console.error(err);
//         router.replace("/signin");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("authToken");
//       router.replace("/signin");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   // Navigation options with icons
//   const profileOptions = [
//     { name: "Edit Profile", icon: "pencil", route: "/editprofile" },
//     { name: "Search Filters", icon: "filter", route: "/searchFilters" },
//     { name: "Settings", icon: "cog", route: "/settings" },
//     { name: "Events", icon: "calendar", route: "/events" },
//     {
//       name: "Help and Support Center",
//       icon: "question-circle",
//       route: "/help",
//     },
//     { name: "Invite Friends", icon: "user-plus", route: "/invite" },
//     { name: "ID Verification", icon: "check-square", route: "/idVerification" },
//     { name: "Log Out", icon: "sign-out", route: handleLogout },
//   ];

//   if (isLoading) return <LoveLoader visible={true} />;
//   if (error) return <Text style={styles.error}>{error}</Text>;

//   return (
//     <View style={styles.container}>
//       <View style={styles.topNav}>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/editprofile")}
//         >
//           <Text style={styles.navText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/photos")}
//         >
//           <Icon name="camera" size={20} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/settings")}
//         >
//           <Icon name="cog" size={20} color={colors.textPrimary} />
//         </TouchableOpacity>
//       </View>
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* User Profile Section */}
//         <Image
//           source={
//             user?.profilePicture
//               ? { uri: user.profilePicture }
//               : require("../assets/images/datingLogo.jpeg")
//           }
//           style={styles.profilePicture}
//         />
//         <Text style={styles.userName}>{user?.name || "User Name"}</Text>

//         {/* Grid Boxes */}
//         <View style={styles.gridContainer}>
//           <View style={styles.gridBox}>
//             <Text style={styles.gridTitle}>Matches</Text>
//             <Text style={styles.gridValue}>{user?.matchesCount || 0}</Text>
//           </View>
//           <View style={styles.gridBox}>
//             <Text style={styles.gridTitle}>Preferences</Text>
//             <Text style={styles.gridValue}>
//               {user?.preferences || "Not set"}
//             </Text>
//           </View>
//         </View>

//         {/* Profile Options List */}
//         {profileOptions.map((option, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.optionItem}
//             onPress={
//               typeof option.route === "function"
//                 ? option.route
//                 : () => router.push(option.route)
//             }
//           >
//             <Text style={styles.optionText}>{option.name}</Text>
//             <Icon name={option.icon} size={20} color={colors.primary} />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//       <Footer />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   topNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: colors.secondary,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.textSecondary,
//   },
//   navItem: {
//     alignItems: "center",
//   },
//   navText: {
//     color: colors.textPrimary,
//     fontSize: 14,
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     alignItems: "center",
//     padding: 20,
//   },
//   profilePicture: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: colors.primary,
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: colors.textPrimary,
//     marginBottom: 20,
//   },
//   gridContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   gridBox: {
//     backgroundColor: colors.secondary,
//     borderRadius: 10,
//     padding: 15,
//     width: "45%",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   gridTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: colors.textPrimary,
//     marginBottom: 5,
//   },
//   gridValue: {
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   optionItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.textSecondary,
//   },
//   optionText: {
//     fontSize: 16,
//     color: colors.textPrimary,
//   },
//   error: {
//     flex: 1,
//     textAlign: "center",
//     color: "red",
//     fontSize: 16,
//     marginTop: 20,
//   },
// });

// export default Profile;



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import api from "../constants/api";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          return;
        }
        console.log(token)
        const response = await api.get("/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError(response.data.message || "Failed to fetch user data");
          router.replace("/signin");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching user data"
        );
        console.error(err);
        router.replace("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/signin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Navigation options with icons
  const profileOptions = [
    { name: "Edit Profile", icon: "pencil", route: "/editprofile" },
    { name: "Search Filters", icon: "filter", route: "/searchFilters" },
    { name: "Settings", icon: "cog", route: "/settings" },
    { name: "Events", icon: "calendar", route: "/events" },
    {
      name: "Help and Support Center",
      icon: "question-circle",
      route: "/help",
    },
    { name: "Invite Friends", icon: "user-plus", route: "/invite" },
    { name: "ID Verification", icon: "check-square", route: "/idVerification" },
    { name: "Log Out", icon: "sign-out", route: handleLogout },
  ];

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/editprofile")}
        >
          <Text style={styles.navText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/photos")}
        >
          <Icon name="camera" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/settings")}
        >
          <Icon name="cog" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Section */}
  <Image
  source={
    user?.profilePicture
      ? { uri: user.profilePicture }
      : { uri: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800" }
  }
  style={styles.profilePicture}
  defaultSource={require("../assets/images/datingLogo.jpeg")}
/>
        <Text style={styles.userName}>{user?.firstName || "not set"} {user?.lastName}</Text>

        {/* Grid Boxes */}
        <View style={styles.gridContainer}>
          <View style={styles.gridBox}>
            <Text style={styles.gridTitle}>Matches</Text>
            <Text style={styles.gridValue}>{user?.matchesCount || 0}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridTitle}>Preferences</Text>
            <Text style={styles.gridValue}>
              {user?.preferences || "Not set"}
            </Text>
          </View>
        </View>

        {/* Profile Options List */}
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={
              typeof option.route === "function"
                ? option.route
                : () => router.push(option.route)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option.name}</Text>
            <Icon name={option.icon} size={20} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Slight gray background for a modern, clean look
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle white overlay for nav items
  },
  navText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'transparent',
    backgroundColor: colors.secondary, // Fallback background for image
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  gridBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))', // Subtle gradient
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary, // Use primary color for emphasis
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White with slight transparency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  error: {
    flex: 1,
    textAlign: 'center',
    color: '#FF4D4D', // Vibrant red for error
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
  },
});

export default Profile;