// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";

// import { useRouter } from "expo-router";
// import Footer from "./others/Footer"
// import colors from "./../colors"
// import LoveLoader from "./others/LoveLoader";
// const matches = () => {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <View style={styles.topNav}>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/likedusers")}
//         >
//           <Text style={styles.navText}>History</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/likedBy")}
//         >
//           <Text style={styles.navText}>Liked-by</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/favorites")}
//         >
//           <Icon name="star" size={20} color={colors.textPrimary} />
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
//         <Image
//           source={require("../assets/images/datingLogo.jpeg")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>Matches</Text>
//         {/* Add matches content here */}
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
//     marginTop:40,
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
//     padding: 30,
//   },
//   scrollContent: {
//     alignItems: "center",
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 40,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: colors.textPrimary,
//     textAlign: "center",
//     marginBottom: 20,
//   },
// });

// export default matches;


















import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getFriends, unfriendUser } from "../constants/api";
import colors from "../colors";
import Footer from "./others/Footer";
import LoveLoader from "./others/LoveLoader";
import Icon from "react-native-vector-icons/FontAwesome"
import CustomError from "./others/customError";

import im from "../assets/images/alady.jpg";

// Pastel colors for horizontal items in modal
const pastelColors = ["#FFF3CD", "#D4EDDA", "#F8D7DA", "#D1ECF1"];

const Matches = () => {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (!storedToken) {
          router.push("/signin");
          return;
        }
        setToken(storedToken);
        const response = await getFriends(storedToken);
        setFriends(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch friends");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleUnfriend = async (userId) => {
    try {
      await unfriendUser(userId, token);
      setFriends(friends.filter((friend) => friend._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unfriend");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error)
    return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

  return (
    <View style={styles.container}>
       <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/likedusers")}
        >
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/likedBy")}
        >
          <Text style={styles.navText}>Liked-by</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/favorites")}
        >
          <Icon name="star" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/settings")}
        >
          <Icon name="cog" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Matches</Text>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.friendCard}
              onPress={() => viewUserDetails(item)}
            >
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : im}
                style={styles.friendImage}
                defaultSource={im}
              />
              <Text
                style={styles.friendName}
              >{`${item.firstName} ${item.lastName}`}</Text>
              <Text style={styles.friendAge}>{item.age || "N/A"}</Text>
              <TouchableOpacity
                style={styles.unfriendButton}
                onPress={() => handleUnfriend(item._id)}
              >
                <Text style={styles.unfriendText}>Unfriend</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noFriendsText}>No matches yet</Text>
      )}
      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedUser && (
              <>
                <Image
                  source={
                    selectedUser.profilePicture
                      ? { uri: selectedUser.profilePicture }
                      : im
                  }
                  style={styles.modalProfileImage}
                  defaultSource={im}
                />
                <Text
                  style={styles.modalName}
                >{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                <Text style={styles.modalDetailText}>
                  Age: {selectedUser.age || "N/A"}
                </Text>
                <Text style={styles.modalDetailText}>
                  Ethnicity: {selectedUser.ethnicity?.[0] || "Not specified"}
                </Text>
                <Text style={styles.modalDetailText}>
                  Faith: {selectedUser.myFaith?.[0] || "Not specified"}
                </Text>
                <Text style={styles.modalDetailText}>
                  State: {selectedUser.state || "Not specified"}
                </Text>
                <Text style={styles.modalDetailText}>
                  Bio: {selectedUser.bio || "No bio available"}
                </Text>
                <Text style={styles.modalDetailText}>
                  Education: {selectedUser.education || "Not specified"}
                </Text>
                <Text style={styles.modalSectionTitle}>About Me</Text>
                {selectedUser.aboutMe?.length > 0 ? (
                  <FlatList
                    data={selectedUser.aboutMe}
                    horizontal
                    keyExtractor={(item, index) => `modal-about-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          {
                            backgroundColor:
                              pastelColors[index % pastelColors.length],
                          },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>No info available</Text>
                )}
                <Text style={styles.modalSectionTitle}>Interests</Text>
                {selectedUser.interests?.length > 0 ? (
                  <FlatList
                    data={selectedUser.interests}
                    horizontal
                    keyExtractor={(item, index) => `modal-interest-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          {
                            backgroundColor:
                              pastelColors[index % pastelColors.length],
                          },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>
                    No interests available
                  </Text>
                )}
                <Text style={styles.modalSectionTitle}>Languages</Text>
                {selectedUser.languages?.length > 0 ? (
                  <FlatList
                    data={selectedUser.languages}
                    horizontal
                    keyExtractor={(item, index) => `modal-language-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          {
                            backgroundColor:
                              pastelColors[index % pastelColors.length],
                          },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>
                    No languages available
                  </Text>
                )}
                <Text style={styles.modalSectionTitle}>Personality</Text>
                {selectedUser.personality?.length > 0 ? (
                  <FlatList
                    data={selectedUser.personality}
                    horizontal
                    keyExtractor={(item, index) => `modal-personality-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          {
                            backgroundColor:
                              pastelColors[index % pastelColors.length],
                          },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>
                    No personality info available
                  </Text>
                )}
                <Text style={styles.modalSectionTitle}>Gallery</Text>
                {selectedUser.gallery?.length > 0 ? (
                  selectedUser.gallery.map((url, index) => (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={styles.modalGalleryImage}
                      defaultSource={im}
                    />
                  ))
                ) : (
                  <Image
                    source={im}
                    style={styles.modalGalleryImage}
                    defaultSource={im}
                  />
                )}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
      <Footer style={styles.localFooter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    marginTop: 30,
  },
   topNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.secondary,
    paddingVertical: 5,
    marginTop:5,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  friendCard: {
    width: "48%",
    backgroundColor: "#F5F0F0FF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  friendName: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
    textAlign: "center",
  },
  friendAge: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 5,
  },
  unfriendButton: {
    backgroundColor: "#FF4D4D",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  unfriendText: {
    color: colors.buttonText,
    fontSize: 12,
    fontWeight: "500",
  },
  noFriendsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
  localFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#E7D7D0FF",
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  modalProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 15,
  },
  modalDetailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
    textAlign: "center",
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  modalItemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  modalGalleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Matches;
