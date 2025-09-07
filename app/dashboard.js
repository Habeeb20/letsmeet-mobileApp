
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../constants/api";
import { getFilteredUsers } from "../constants/api";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
import { useLocalSearchParams } from "expo-router";


const { width } = Dimensions.get("window");
const Dashboard = () => {
  const { token } = useLocalSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigateToScreen = (screen) => {
    router.push(`/${screen}`);
  };

    useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          return;
        }
        const response = await getFilteredUsers(token);
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);


   const handleCancel = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start if at the end
    }
    logVisit(users[currentIndex]._id);
  };

  const handleLike = () => {
    // Implement like logic (e.g., save to favorites in backend)
    console.log("Liked user:", users[currentIndex]?._id);
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start if at the end
    }
    logVisit(users[currentIndex]._id);
  };


  
  const logVisit = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await api.post(`/api/dating/${userId}/visit`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Failed to log visit:", err);
    }
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!users.length) {
    return (
      <View style={styles.noUsersContainer}>
        <Icon name="heart" size={50} color={colors.primary} style={styles.heartIcon} />
        <Text style={styles.noUsersText}>No Matches Yet!</Text>
        <Text style={styles.noUsersSubText}>
          Swipe right to like or left to pass. Find your perfect match!
        </Text>
        <Icon name="heart" size={40} color={colors.primary} style={[styles.heartIcon, { marginTop: 20 }]} />
        <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
     <Footer
      style={styles.localFooter}
    />
      </View>
    );
  }

  const currentUser = users[currentIndex];



  return (
      <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={
              currentUser?.profilePicture
                ? { uri: currentUser.profilePicture }
                : { uri: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800" }
            }
            style={styles.profileImage}
            defaultSource={require("../assets/images/datingLogo.jpeg")}
          />
          <View style={styles.header}>
            <Text style={styles.name}>{`${currentUser.firstName} ${currentUser.lastName}`}</Text>
            <Text style={styles.age}>{currentUser.age}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.detailText}>Ethnicity: {currentUser.ethnicity[0] || "Not specified"}</Text>
            <Text style={styles.detailText}>Faith: {currentUser.myFaith[0] || "Not specified"}</Text>
            <Text style={styles.detailText}>State: {currentUser.state || "Not specified"}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Icon name="times" size={30} color="#FF4D4D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <Icon name="star" size={30} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.additionalDetails}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {currentUser.aboutMe.map((item, index) => (
            <Text key={index} style={styles.detailText}>{item}</Text>
          ))}
          <Text style={styles.sectionTitle}>Interests</Text>
          {currentUser.interests.map((item, index) => (
            <Text key={index} style={styles.detailText}>{item}</Text>
          ))}
          <Text style={styles.sectionTitle}>Languages</Text>
          {currentUser.languages.map((item, index) => (
            <Text key={index} style={styles.detailText}>{item}</Text>
          ))}
          <Text style={styles.sectionTitle}>Personality</Text>
          {currentUser.personality.map((item, index) => (
            <Text key={index} style={styles.detailText}>{item}</Text>
          ))}
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.detailText}>{currentUser.bio || "No bio available"}</Text>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.detailText}>{currentUser.education || "Not specified"}</Text>
          <Text style={styles.sectionTitle}>Gallery</Text>
          {currentUser.gallery.length > 0 ? (
            currentUser.gallery.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.galleryImage} />
            ))
          ) : (
            <Text style={styles.detailText}>No gallery images</Text>
          )}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scroll: { flex: 1 },
  scrollContent: { alignItems: "center", padding: 20 },
  card: {
    width: width - 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.primary,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginRight: 10,
  },
  age: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "600",
  },
  details: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#FFE6E6",
    borderRadius: 50,
    padding: 15,
    shadowColor: "#FF4D4D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButton: {
    backgroundColor: "#FFF3E0",
    borderRadius: 50,
    padding: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  additionalDetails: {
    width: width - 40,
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  noUsersText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginVertical: 10,
  },
  noUsersSubText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  heartIcon: {
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
   
  },
  refreshButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "500",
  },
  error: {
    flex: 1,
    textAlign: "center",
    color: "#FF4D4D",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
  },

localFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#E0E0E0", // Light gray to match the page theme
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  padding:20,

  },
});

export default Dashboard;






































