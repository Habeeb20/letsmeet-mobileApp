


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { getFriends, unfriendUser } from "../constants/api";
// import colors from "../colors";
// import Footer from "./others/Footer";
// import LoveLoader from "./others/LoveLoader";
// import Icon from "react-native-vector-icons/FontAwesome";
// import CustomError from "./others/customError";

// import im from "../assets/images/alady.jpg";

// // Pastel colors for horizontal items in modal
// const pastelColors = ["#FFF3CD", "#D4EDDA", "#F8D7DA", "#D1ECF1"];

// const Matches = () => {
//   const router = useRouter();
//   const [friends, setFriends] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const storedToken = await AsyncStorage.getItem("authToken");
//         if (!storedToken) {
//           router.push("/signin");
//           return;
//         }
//         setToken(storedToken);
//         const response = await getFriends(storedToken);
//         setFriends(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch friends");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchFriends();
//   }, []);

//   const handleUnfriend = async (userId) => {
//     try {
//       await unfriendUser(userId, token);
//       setFriends(friends.filter((friend) => friend._id !== userId));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to unfriend");
//     }
//   };

//   const viewUserDetails = (user) => {
//     setSelectedUser(user);
//   };

//   const closeModal = () => {
//     setSelectedUser(null);
//   };

//   if (isLoading) return <LoveLoader visible={true} />;
//   if (error)
//     return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

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
//           onPress={() => router.push("/visitorScreen")}
//         >
//           <Text style={styles.navText}>Visited You</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push("/settings")}
//         >
//           <Text style={styles.navText}>Favorite</Text>
//           {/* <Icon name="cog" size={20} color={colors.textPrimary} /> */}
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.title}>Matches</Text>
//       {friends.length > 0 ? (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item._id}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.friendCard}
//               onPress={() => viewUserDetails(item)}
//             >
//               <Image
//                 source={item.profilePicture ? { uri: item.profilePicture } : im}
//                 style={styles.friendImage}
//                 defaultSource={im}
//               />
//               <Text style={styles.friendName}>{`${item.firstName} ${item.lastName}`}</Text>
//               <Text style={styles.friendAge}>{item.age || "N/A"}</Text>
//               <TouchableOpacity
//                 style={styles.unfriendButton}
//                 onPress={() => handleUnfriend(item._id)}
//               >
//                 <Text style={styles.unfriendText}>X</Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//           )}
//         />
//       ) : (
//         <Text style={styles.noFriendsText}>No matches yet</Text>
//       )}
//       {/* User Details Modal */}
//       <Modal
//         visible={!!selectedUser}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             {selectedUser && (
//               <>
//                 <Image
//                   source={
//                     selectedUser.profilePicture
//                       ? { uri: selectedUser.profilePicture }
//                       : im
//                   }
//                   style={styles.modalProfileImage}
//                   defaultSource={im}
//                 />
//                 <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
//                 <Text style={styles.modalDetailText}>
//                   Age: {selectedUser.age || "N/A"}
//                 </Text>
//                 <Text style={styles.modalDetailText}>
//                   Ethnicity: {selectedUser.ethnicity?.[0] || "Not specified"}
//                 </Text>
//                 <Text style={styles.modalDetailText}>
//                   Faith: {selectedUser.myFaith?.[0] || "Not specified"}
//                 </Text>
//                 <Text style={styles.modalDetailText}>
//                   State: {selectedUser.state || "Not specified"}
//                 </Text>
//                 <Text style={styles.modalDetailText}>
//                   Bio: {selectedUser.bio || "No bio available"}
//                 </Text>
//                 <Text style={styles.modalDetailText}>
//                   Education: {selectedUser.education || "Not specified"}
//                 </Text>
//                 <Text style={styles.modalSectionTitle}>About Me</Text>
//                 {selectedUser.aboutMe?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.aboutMe}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-about-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           {
//                             backgroundColor:
//                               pastelColors[index % pastelColors.length],
//                           },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>No info available</Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Interests</Text>
//                 {selectedUser.interests?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.interests}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-interest-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           {
//                             backgroundColor:
//                               pastelColors[index % pastelColors.length],
//                           },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>
//                     No interests available
//                   </Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Languages</Text>
//                 {selectedUser.languages?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.languages}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-language-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           {
//                             backgroundColor:
//                               pastelColors[index % pastelColors.length],
//                           },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>
//                     No languages available
//                   </Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Personality</Text>
//                 {selectedUser.personality?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.personality}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-personality-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           {
//                             backgroundColor:
//                               pastelColors[index % pastelColors.length],
//                           },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>
//                     No personality info available
//                   </Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Gallery</Text>
//                 {selectedUser.gallery?.length > 0 ? (
//                   selectedUser.gallery.map((url, index) => (
//                     <Image
//                       key={index}
//                       source={{ uri: url }}
//                       style={styles.modalGalleryImage}
//                       defaultSource={im}
//                     />
//                   ))
//                 ) : (
//                   <Image
//                     source={im}
//                     style={styles.modalGalleryImage}
//                     defaultSource={im}
//                   />
//                 )}
//                 <TouchableOpacity
//                   style={styles.modalCloseButton}
//                   onPress={closeModal}
//                 >
//                   <Text style={styles.modalButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </ScrollView>
//         </View>
//       </Modal>
//       <Footer style={styles.localFooter} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F0F0FF", // Light pastel background from image
//     padding: 10,
//     marginTop: 0, // Remove extra margin
//   },
//   topNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "transparent", // Gradient will handle background
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//     marginBottom: 10,
//     marginTop:25
//   },
//   navItem: {
//     alignItems: "center",

//   },
//   navText: {
//     color: "#171414FF", // White text for contrast with gradient
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#333333", // Darker text for contrast
//     marginBottom: 15,
//     textAlign: "center",
//     textTransform: "uppercase",
//   },
//   row: {
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   friendCard: {
//     width: "48%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 15,
//     padding: 10,
//     marginBottom: 10,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   friendImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: "#4A90E2", // Blue border from image
//   },
//   friendName: {
//     fontSize: 16,
//     color: "#333333",
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 5,
//   },
//   friendAge: {
//     fontSize: 14,
//     color: "#666666",
//     marginBottom: 10,
//   },
//   unfriendButton: {
//     backgroundColor: "#FF4D4D", // Red "X" button
//     padding: 8,
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   unfriendText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   noFriendsText: {
//     fontSize: 16,
//     color: "#666666",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   localFooter: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     backgroundColor: "#E0E0E0",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#FFFFFF", // White background from image
//     padding: 20,
//   },
//   modalContent: {
//     alignItems: "center",
//     paddingBottom: 40,
//   },
//   modalProfileImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     borderWidth: 4,
//     borderColor: "#4A90E2", // Blue border from image
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalName: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#333333",
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   modalDetailText: {
//     fontSize: 16,
//     color: "#666666",
//     marginVertical: 5,
//     textAlign: "center",
//   },
//   modalSectionTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#333333",
//     marginTop: 15,
//     marginBottom: 10,
//     textAlign: "center",
//     textTransform: "uppercase",
//   },
//   modalItemContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     marginRight: 10,
//     marginVertical: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   modalItemText: {
//     fontSize: 14,
//     color: "#333333",
//     fontWeight: "500",
//   },
//   modalGalleryImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 15,
//     marginVertical: 5,
//     borderWidth: 2,
//     borderColor: "#4A90E2", // Blue border from image
//   },
//   modalCloseButton: {
//     backgroundColor: "#4A90E2", // Blue button from image
//     padding: 12,
//     borderRadius: 20,
//     alignSelf: "center",
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });


// export default Matches


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
import { getFriends, unfriendUser, addFavorite } from "../constants/api";
import colors from "../colors";
import Footer from "./others/Footer";
import LoveLoader from "./others/LoveLoader";
import Icon from "react-native-vector-icons/FontAwesome";
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

  const handleFavorite = async (userId) => {
    try {
      await addFavorite(userId, token);
      // Optionally update local state to reflect favorite status
      setFriends(
        friends.map((friend) =>
          friend._id === userId ? { ...friend, isFavorite: true } : friend
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to favorites");
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
          onPress={() => router.push("/visitorScreen")}
        >
          <Text style={styles.navText}>Visited You</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/favorite")}
        >
          <Text style={styles.navText}>Favorite</Text>
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
              <Text style={styles.friendName}>{`${item.firstName} ${item.lastName}`}</Text>
              <Text style={styles.friendAge}>{item.age || "N/A"}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.unfriendButton}
                  onPress={() => handleUnfriend(item._id)}
                >
                  <Text style={styles.unfriendText}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleFavorite(item._id)}
                >
                  <Icon name="heart" size={20} color="#FF69B4" />
                </TouchableOpacity>
              </View>
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
                <View style={styles.modalHeader}>
                  <Image
                    source={
                      selectedUser.profilePicture
                        ? { uri: selectedUser.profilePicture }
                        : im
                    }
                    style={styles.modalProfileImage}
                    defaultSource={im}
                  />
                  <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalDetail}>Age: {selectedUser.age || "N/A"}</Text>
                  <Text style={styles.modalDetail}>Ethnicity: {selectedUser.ethnicity?.[0] || "Not specified"}</Text>
                  <Text style={styles.modalDetail}>Faith: {selectedUser.myFaith?.[0] || "Not specified"}</Text>
                  <Text style={styles.modalDetail}>State: {selectedUser.state || "Not specified"}</Text>
                  <Text style={styles.modalDetail}>Education: {selectedUser.education || "Not specified"}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.modalDetail}>{selectedUser.bio || "No bio available"}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>About Me</Text>
                  {selectedUser.aboutMe?.length > 0 ? (
                    selectedUser.aboutMe.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No info available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  {selectedUser.interests?.length > 0 ? (
                    selectedUser.interests.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No interests available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  {selectedUser.languages?.length > 0 ? (
                    selectedUser.languages.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No languages available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Personality</Text>
                  {selectedUser.personality?.length > 0 ? (
                    selectedUser.personality.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No personality info available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Gallery</Text>
                  {selectedUser.gallery?.length > 0 ? (
                    <FlatList
                      data={selectedUser.gallery}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      renderItem={({ item }) => (
                        <Image
                          source={{ uri: item }}
                          style={styles.galleryImage}
                          defaultSource={im}
                        />
                      )}
                      contentContainerStyle={styles.galleryList}
                    />
                  ) : (
                    <Text style={styles.modalDetail}>No gallery images</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: "#F5F0F0FF",
    padding: 10,
    marginTop: 0,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
    marginTop: 25,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#171414FF",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  friendCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  friendImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  friendName: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  friendAge: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  unfriendButton: {
    backgroundColor: "#FF4D4D",
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  unfriendText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  favoriteButton: {
    backgroundColor: "#FFB6C1",
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  noFriendsText: {
    fontSize: 16,
    color: "#666666",
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
    backgroundColor: "#F5F5F5",
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  modalSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalDetail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  galleryList: {
    paddingVertical: 10,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Matches;