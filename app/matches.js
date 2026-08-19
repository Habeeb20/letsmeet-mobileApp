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
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getFriends, unfriendUser, addFavorite } from "../constants/api";
import Footer from "./others/Footer";
import LoveLoader from "./others/LoveLoader";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomError from "./others/customError";

import im from "../assets/images/alady.jpg";

// Light variant of the app's palette — same rose/sunset accents, white surfaces.
// If your other screens (Feed, Create Post) stay on the dark plum theme,
// this intentionally diverges just for Matches per your request.
const palette = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceRaised: "#FBEFF3",
  border: "#F1E1E8",
  textPrimary: "#241729",
  textSecondary: "#6E5E68",
  textFaint: "#A793A0",
  rose: "#D46A94",
  roseSoft: "#FCEAF1",
  danger: "#E5484D",
  dangerSoft: "#FCE9E9",
  sunsetStart: "#FF6F61",
  sunsetEnd: "#FFB86B",
};

const cardShadow = {
  shadowColor: "#4A2A3A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - CARD_GAP) / 2;

const TOP_NAV = [
  { label: "History", icon: "history", route: "/likedusers" },
  { label: "Liked-by", icon: "favorite-border", route: "/likedBy" },
  { label: "Visited", icon: "visibility", route: "/visitorScreen" },
  { label: "Favorites", icon: "star-border", route: "/favorite" },
];

const Chips = ({ title, items }) => (
  <View style={styles.modalSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items?.length > 0 ? (
      <View style={styles.chipWrap}>
        {items.map((item, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={styles.modalDetail}>Nothing added yet</Text>
    )}
  </View>
);

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
      setFriends(
        friends.map((friend) =>
          friend._id === userId ? { ...friend, isFavorite: true } : friend
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to favorites");
    }
  };

  const viewUserDetails = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <Text style={styles.title}>Matches</Text>
              <Text style={styles.subtitle}>
                {friends.length} {friends.length === 1 ? "connection" : "connections"}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topNav}
            >
              {TOP_NAV.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.navItem}
                  onPress={() => router.push(item.route)}
                >
                  <Icon name={item.icon} size={16} color={palette.rose} />
                  <Text style={styles.navText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="favorite-border" size={30} color={palette.textFaint} />
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>Keep exploring \u2014 your next connection is close</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendCardShadow}
            activeOpacity={0.9}
            onPress={() => viewUserDetails(item)}
          >
            <View style={styles.friendCard}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : im}
                style={styles.friendImage}
                defaultSource={im}
              />
              <LinearGradient
                colors={["transparent", "rgba(24,15,31,0.92)"]}
                style={styles.cardGradient}
              />

              <TouchableOpacity
                style={styles.unfriendBtn}
                onPress={() => handleUnfriend(item._id)}
                hitSlop={6}
              >
                <Icon name="close" size={14} color={palette.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => handleFavorite(item._id)}
                hitSlop={6}
              >
                <Icon
                  name={item.isFavorite ? "favorite" : "favorite-border"}
                  size={16}
                  color={item.isFavorite ? palette.sunsetStart : palette.textPrimary}
                />
              </TouchableOpacity>

              <View style={styles.cardTextWrap}>
                <Text style={styles.friendName} numberOfLines={1}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.friendAge}>{item.age ? `${item.age} yrs` : "Age N/A"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* User Details Modal */}
      <Modal visible={!!selectedUser} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedUser && (
              <>
                <View style={styles.modalHero}>
                  <Image
                    source={
                      selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : im
                    }
                    style={styles.modalProfileImage}
                    defaultSource={im}
                  />
                  <Text style={styles.modalName}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                  {!!selectedUser.age && <Text style={styles.modalAge}>{selectedUser.age} years old</Text>}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Details</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Icon name="public" size={14} color={palette.rose} />
                      <Text style={styles.modalDetail}>{selectedUser.ethnicity?.[0] || "Not specified"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="self-improvement" size={14} color={palette.rose} />
                      <Text style={styles.modalDetail}>{selectedUser.myFaith?.[0] || "Not specified"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="place" size={14} color={palette.rose} />
                      <Text style={styles.modalDetail}>{selectedUser.state || "Not specified"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="school" size={14} color={palette.rose} />
                      <Text style={styles.modalDetail}>{selectedUser.education || "Not specified"}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.modalDetail}>{selectedUser.bio || "No bio available"}</Text>
                </View>

                <Chips title="About me" items={selectedUser.aboutMe} />
                <Chips title="Interests" items={selectedUser.interests} />
                <Chips title="Languages" items={selectedUser.languages} />
                <Chips title="Personality" items={selectedUser.personality} />

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Gallery</Text>
                  {selectedUser.gallery?.length > 0 ? (
                    <FlatList
                      data={selectedUser.gallery}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.galleryImage} defaultSource={im} />
                      )}
                      contentContainerStyle={{ gap: 10 }}
                    />
                  ) : (
                    <Text style={styles.modalDetail}>No gallery images</Text>
                  )}
                </View>

                <View style={{ height: 90 }} />
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity activeOpacity={0.85} onPress={closeModal}>
              <LinearGradient
                colors={[palette.sunsetStart, palette.sunsetEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer style={styles.localFooter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topBar: {
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: palette.textPrimary,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: palette.textFaint,
    fontSize: 13,
    marginTop: 2,
  },
  topNav: {
    gap: 8,
    paddingVertical: 14,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    ...cardShadow,
  },
  navText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },
  friendCardShadow: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 22,
    backgroundColor: palette.surface,
    ...cardShadow,
  },
  friendCard: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.border,
  },
  friendImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  unfriendBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(24,15,31,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(24,15,31,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
  },
  friendName: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  friendAge: {
    color: palette.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 50,
    gap: 6,
  },
  emptyTitle: {
    color: palette.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    marginTop: 6,
  },
  emptySubtitle: {
    color: palette.textFaint,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  localFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 40,
    gap: 14,
  },
  modalHero: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 22,
    ...cardShadow,
  },
  modalProfileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: palette.rose,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 22,
    fontWeight: "800",
    color: palette.textPrimary,
    textAlign: "center",
  },
  modalAge: {
    fontSize: 13,
    color: palette.textFaint,
    marginTop: 4,
  },
  modalSection: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "47%",
  },
  modalDetail: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 20,
    flexShrink: 1,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: palette.roseSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    color: palette.rose,
    fontSize: 12,
    fontWeight: "600",
  },
  galleryImage: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: palette.surfaceRaised,
  },
  modalFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 18,
    backgroundColor: palette.bg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    shadowColor: "#4A2A3A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  closeButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: palette.bg,
    fontWeight: "800",
    fontSize: 15,
  },
});

export default Matches;