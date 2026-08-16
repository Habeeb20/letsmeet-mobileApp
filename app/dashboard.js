import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  ActivityIndicator,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getFilteredUsers, likeUser, getLikedUsers } from "../constants/api";
import api from "../constants/api";
import im from "../assets/images/alady.jpg";
import  Footer from "./others/Footer"
const { width } = Dimensions.get("window");
const CARD_PADDING = 18;
const TAG_COLORS = ["#FFE4E1", "#FFF3D6", "#E1F0FF", "#E8F7EC", "#F3E1FF"];

const NAV_ITEMS = [
  { key: "dashboard", icon: "flame", label: "Discover", route: "/dashboard" },
  { key: "likes", icon: "heart", label: "Likes", route: "/likes" },
  { key: "chat", icon: "chatbubble-ellipses", label: "Chat", route: "/chat" },
  { key: "profile", icon: "person", label: "Profile", route: "/mydata" },
];

function BottomBar({ active = "dashboard" }) {
  const router = useRouter();
  return (
    <View style={styles.bottomBar}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.7}
          >
            {isActive ? (
              <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.navIconActive}>
                <Ionicons name={item.icon} size={19} color="#fff" />
              </LinearGradient>
            ) : (
              <Ionicons name={`${item.icon}-outline`} size={22} color="#B5A3A3" />
            )}
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TagList({ title, items, emptyText }) {
  if (!items?.length) {
    return (
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={items}
        horizontal
        keyExtractor={(item, i) => `${title}-${i}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.tag, { backgroundColor: TAG_COLORS[index % TAG_COLORS.length] }]}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

function GalleryGrid({ images, onSelect }) {
  if (!images?.length) {
    return (
      <View style={styles.galleryEmptyWrap}>
        <Image source={im} style={styles.galleryEmptyImage} />
      </View>
    );
  }
  return (
    <View style={styles.galleryGrid}>
      {images.map((url, i) => (
        <TouchableOpacity key={i} onPress={() => onSelect(url)} style={styles.galleryImageWrap}>
          <Image source={{ uri: url }} style={styles.galleryImage} defaultSource={im} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ProfileDetails({ user }) {
  return (
    <>
      <TagList title="About Me" items={user.aboutMe} emptyText="No info available" />
      <TagList title="Interests" items={user.interests} emptyText="No interests available" />
      <TagList title="Languages" items={user.languages} emptyText="No languages available" />
      <TagList title="Personality" items={user.personality} emptyText="No personality info available" />

      <Text style={styles.sectionTitle}>Bio</Text>
      <Text style={styles.bodyText}>{user.bio || "No bio available"}</Text>

      <Text style={styles.sectionTitle}>Education</Text>
      <Text style={styles.bodyText}>{user.education || "Not specified"}</Text>
    </>
  );
}

function MiniProfileList({ title, data, emptyText, onPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPress(item)} style={styles.miniProfile}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : im}
                style={styles.miniProfileImage}
                defaultSource={im}
              />
              <Text style={styles.miniProfileName} numberOfLines={1}>
                {item.firstName} {item.lastName}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

const Dashboard = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedEmail = (await AsyncStorage.getItem("userEmail")) || email;
      const storedToken = await AsyncStorage.getItem("authToken");
      if (!storedEmail || !storedToken) {
        router.push("/signin");
        return;
      }
      setToken(storedToken);

      const response = await getFilteredUsers(storedEmail);
      setUsers(response.data.data);

      const likedResponse = await getLikedUsers(storedToken);
      setLikedUsers(likedResponse.data);

      const visitorsResponse = await api.get("/api/dating/visitors", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setVisitors(visitorsResponse.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logVisit = async (userId) => {
    try {
      if (userId && token) {
        await api.post(
          "/api/dating/visit",
          { profileId: userId },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Failed to log visit:", err);
    }
  };

  const handleCancel = () => {
    logVisit(users[currentIndex]?._id);
    setCurrentIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
  };

  const handleLike = async () => {
    const userId = users[currentIndex]?._id;
    if (!userId || !token) return;
    try {
      await likeUser(userId, token);
      setLikedUsers((prev) => [...prev, users[currentIndex]]);
      logVisit(userId);
      setCurrentIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
    } catch (err) {
      console.error("Like error:", err);
      setError("Failed to like user");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    logVisit(user._id);
  };

  // ── Shared screen shell: every state below renders inside this,
  // so the bottom bar is always present regardless of loading/error/empty/content ──
  const Screen = ({ children }) => (
    <View style={styles.container}>
      <View style={styles.screenBody}>{children}</View>
      <Footer active="dashboard" />
     
    </View>
  );

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centerScreen}>
          <ActivityIndicator size="large" color="#FF3D77" />
          <Text style={styles.loadingText}>Finding your matches…</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.centerScreen}>
          <Ionicons name="alert-circle-outline" size={40} color="#E8877A" />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.buttonShadow}>
            <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.button}>
              <Text style={styles.buttonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (!users.length) {
    return (
      <Screen>
        <View style={styles.centerScreen}>
          <Ionicons name="heart-outline" size={56} color="#FF3D77" />
          <Text style={styles.noUsersText}>No Matches Yet!</Text>
          <Text style={styles.noUsersSubText}>
            Swipe right to like or left to pass. Find your perfect match!
          </Text>
          <TouchableOpacity onPress={fetchData} style={styles.buttonShadow}>
            <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.button}>
              <Text style={styles.buttonText}>Refresh</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const currentUser = users[currentIndex];
  const profileImage = currentUser?.profilePicture ? { uri: currentUser.profilePicture } : im;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Swipe card */}
        <View style={styles.swipeCard}>
          <Image source={profileImage} style={styles.swipeImage} defaultSource={im} />
          <LinearGradient
            colors={["transparent", "rgba(61,44,46,0.85)"]}
            style={styles.swipeGradient}
          >
            <View style={styles.swipeHeader}>
              <Text style={styles.name}>
                {currentUser.firstName} {currentUser.lastName}
                {currentUser.age ? <Text style={styles.age}>, {currentUser.age}</Text> : null}
              </Text>
            </View>
            <View style={styles.chipRow}>
              {!!currentUser.state && (
                <View style={styles.chip}>
                  <Ionicons name="location-outline" size={12} color="#fff" />
                  <Text style={styles.chipText}>{currentUser.state}</Text>
                </View>
              )}
              {!!currentUser.myFaith?.[0] && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{currentUser.myFaith[0]}</Text>
                </View>
              )}
              {!!currentUser.ethnicity?.[0] && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{currentUser.ethnicity[0]}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.passButton} onPress={handleCancel} accessibilityLabel="Pass">
            <Ionicons name="close" size={28} color="#E8877A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButtonShadow} onPress={handleLike} accessibilityLabel="Like">
            <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.likeButton}>
              <Ionicons name="heart" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <ProfileDetails user={currentUser} />

          <Text style={styles.sectionTitle}>Gallery</Text>
          <GalleryGrid
            images={currentUser.gallery}
            onSelect={(url) => {
              setSelectedImage(url);
              setImageModalVisible(true);
            }}
          />
        </View>

        <MiniProfileList
          title="Users You Liked"
          data={likedUsers}
          emptyText="No users liked yet"
          onPress={viewUserDetails}
        />

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Fullscreen image modal */}
      <Modal animationType="fade" transparent visible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.imageModalBg}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* Selected user detail modal */}
      <Modal visible={!!selectedUser} animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.userModalContainer}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {selectedUser && (
              <>
                <TouchableOpacity
                  onPress={() => setSelectedUser(null)}
                  style={styles.modalBackButton}
                >
                  <Ionicons name="arrow-back" size={22} color="#3D2C2E" />
                </TouchableOpacity>

                <Image
                  source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : im}
                  style={styles.modalProfileImage}
                  defaultSource={im}
                />
                <Text style={styles.modalName}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Text style={styles.modalMeta}>
                  {selectedUser.age ? `${selectedUser.age} · ` : ""}
                  {selectedUser.state || "Location not specified"}
                </Text>

                <View style={styles.card}>
                  <ProfileDetails user={selectedUser} />
                  <Text style={styles.sectionTitle}>Gallery</Text>
                  <GalleryGrid
                    images={selectedUser.gallery}
                    onSelect={(url) => {
                      setSelectedImage(url);
                      setImageModalVisible(true);
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedUser(null)}
                  style={[styles.buttonShadow, { alignSelf: "center", marginTop: 20 }]}
                >
                  <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  screenBody: {
    flex: 1,
  },
  scrollContent: {
    padding: CARD_PADDING,
    paddingBottom: 24,
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F5",
    padding: 24,
  },
  loadingText: {
    color: "#8A7373",
    fontSize: 13,
    marginTop: 12,
  },
  swipeCard: {
    width: "100%",
    height: 460,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  swipeImage: {
    width: "100%",
    height: "100%",
  },
  swipeGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  swipeHeader: {
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  age: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginTop: 20,
  },
  passButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#F3E4E2",
    shadowColor: "#3D2C2E",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  likeButtonShadow: {
    borderRadius: 34,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  likeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#F3E4E2",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#3D2C2E",
  },
  bodyText: {
    fontSize: 13.5,
    color: "#5A4A4C",
    marginTop: 6,
    lineHeight: 19,
  },
  emptyText: {
    fontSize: 12.5,
    color: "#B5A3A3",
    marginTop: 6,
    fontStyle: "italic",
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 8,
  },
  tagText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#3D2C2E",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  galleryImageWrap: {
    width: (width - CARD_PADDING * 2 - 18 * 2 - 16) / 3,
    height: (width - CARD_PADDING * 2 - 18 * 2 - 16) / 3,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  galleryEmptyWrap: {
    marginTop: 8,
  },
  galleryEmptyImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  noUsersText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3D2C2E",
    marginTop: 12,
  },
  noUsersSubText: {
    fontSize: 13.5,
    color: "#8A7373",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  error: {
    fontSize: 14,
    color: "#E8877A",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonShadow: {
    borderRadius: 999,
    shadowColor: "#FF3D77",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 34,
    borderRadius: 999,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  miniProfile: {
    alignItems: "center",
    marginRight: 14,
    width: 76,
  },
  miniProfileImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#FF3D77",
  },
  miniProfileName: {
    fontSize: 11.5,
    color: "#3D2C2E",
    textAlign: "center",
    marginTop: 6,
    fontWeight: "600",
  },
  footerSpacer: {
    height: 20,
  },
  imageModalBg: {
    flex: 1,
    backgroundColor: "rgba(20,10,10,0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullScreenImage: {
    width: width - 40,
    height: "80%",
    borderRadius: 16,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 24,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  userModalContainer: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  modalBackButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3E4E2",
  },
  modalProfileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#FF3D77",
  },
  modalName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D2C2E",
    textAlign: "center",
    marginTop: 14,
  },
  modalMeta: {
    fontSize: 13.5,
    color: "#8A7373",
    textAlign: "center",
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3E4E2",
    paddingTop: 10,
    paddingBottom: Platform.select({ ios: 26, android: 14, default: 14 }),
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navIconActive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10.5,
    color: "#B5A3A3",
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#FF3D77",
  },
});

export default Dashboard;