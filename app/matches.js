import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { useRouter } from "expo-router";
import Footer from "./others/Footer"
import colors from "./../colors"
import LoveLoader from "./others/LoveLoader";
const matches = () => {
  const router = useRouter();

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={require("../assets/images/datingLogo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Matches</Text>
        {/* Add matches content here */}
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    marginTop:40,
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
  scroll: {
    flex: 1,
    padding: 30,
  },
  scrollContent: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 40,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default matches;
