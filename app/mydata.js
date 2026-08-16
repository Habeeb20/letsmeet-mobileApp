import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Footer from "./others/Footer";
import LoveLoader from "./others/LoveLoader";
import api from "../constants/api";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800";

const PROFILE_OPTIONS = [
  { name: "Edit Profile", desc: "Photos, bio & details", icon: "create-outline", route: "/editprofile" },
  { name: "Search Filters", desc: "Who you want to see", icon: "options-outline", route: "/searchFilters" },
  { name: "Create Post", desc: "Share to your feed", icon: "add-circle-outline", route: "/createPostScreen" },
  { name: "Settings", desc: "Account & privacy", icon: "settings-outline", route: "/settings" },
  { name: "Events", desc: "Meetups near you", icon: "calendar-outline", route: "/events" },
  { name: "Help & Support", desc: "Get assistance", icon: "help-circle-outline", route: "/help" },
  { name: "ID Verification", desc: "Verify your identity", icon: "shield-checkmark-outline", route: "/idVerification" },
];

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          return;
        }
        const response = await api.get("/api/auth/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError(response.data.message || "Failed to fetch user data");
          router.replace("/signin");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching user data");
        console.error(err);
        router.replace("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/signin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoading) return <LoveLoader visible={true} />;

  if (error) {
    return (
      <View style={styles.errorScreen}>
        <Ionicons name="alert-circle-outline" size={40} color="#E8877A" />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/photos")}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={19} color="#3D2C2E" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Image
                  source={{ uri: user?.profilePicture || FALLBACK_IMAGE }}
                  style={styles.profilePicture}
                />
              </View>
            </LinearGradient>
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => router.push("/editprofile")}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user?.firstName || "Not set"} {user?.lastName}
          </Text>
          {!!user?.email && <Text style={styles.userEmail}>{user.email}</Text>}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/settings")}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={19} color="#3D2C2E" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FFE4E1" }]}>
              <Ionicons name="heart" size={16} color="#FF3D77" />
            </View>
            <Text style={styles.statValue}>{user?.matchesCount ?? 0}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#E1F0FF" }]}>
              <Ionicons name="options" size={16} color="#3D8BFF" />
            </View>
            <Text style={styles.statValue} numberOfLines={1}>
              {user?.preferences || "Not set"}
            </Text>
            <Text style={styles.statLabel}>Preferences</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsCard}>
          {PROFILE_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.name}
              style={[
                styles.optionItem,
                index === PROFILE_OPTIONS.length - 1 && styles.optionItemLast,
              ]}
              onPress={() => router.push(option.route)}
              activeOpacity={0.6}
            >
              <View style={styles.optionIconWrap}>
                <Ionicons name={option.icon} size={18} color="#FF3D77" />
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionText}>{option.name}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D8C7C6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#E8877A" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footerSpacer} />
      </ScrollView>
      <Footer active="mydata" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  errorScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F5",
    padding: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconButton: {
    position: "absolute",
    top: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3E4E2",
  },
  avatarWrap: {
    marginTop: 6,
  },
  avatarRing: {
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#fff",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF3D77",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF8F5",
  },
  userName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#3D2C2E",
    marginTop: 14,
  },
  userEmail: {
    fontSize: 12.5,
    color: "#8A7373",
    marginTop: 3,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3E4E2",
    alignItems: "flex-start",
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D2C2E",
  },
  statLabel: {
    fontSize: 11.5,
    color: "#B5A3A3",
    marginTop: 2,
    fontWeight: "600",
  },
  optionsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#F3E4E2",
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8EFEE",
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFE4E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#3D2C2E",
  },
  optionDesc: {
    fontSize: 11.5,
    color: "#B5A3A3",
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#FFF1EE",
    borderWidth: 1,
    borderColor: "#F5D9D3",
  },
  logoutText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#E8877A",
  },
  error: {
    fontSize: 14,
    color: "#E8877A",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  footerSpacer: {
    height: 12,
  },
});

export default Profile;