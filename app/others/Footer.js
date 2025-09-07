import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../colors";

import { useRouter } from "expo-router"; // Removed unused ScrollView import

const Footer = () => {
  const router = useRouter(); // Initialize router

  const navigateToScreen = (screen) => {
    router.push(`/${screen}`); // Ensure screen names match routes in app/ directory
  };

  return (
    <View>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen("dashboard")}
        >
          <Icon name="compass" size={24} color={colors.primary} />
          <Text style={styles.navText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen("matches")}
        >
          <Icon name="heart" size={24} color={colors.primary} />
          <Text style={styles.navText}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen("messages")}
        >
          <Icon name="comment" size={24} color={colors.primary} />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen("social")}
        >
          <Icon name="users" size={24} color={colors.primary} />
          <Text style={styles.navText}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen("mydata")}
        >
          <Icon name="user" size={24} color={colors.primary} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    marginVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: colors.textPrimary,
    fontSize: 12,
    marginTop: 5,
  },
});

export default Footer; // Capitalized component name for convention
