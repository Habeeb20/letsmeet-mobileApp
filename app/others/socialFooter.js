
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import colors from "../../colors";
// import { useRouter } from "expo-router";

// const SocialFooter = () => {
//   const router = useRouter(); // Initialize router

//   const navigateToScreen = (screen) => {
//     router.push(`/${screen}`); // Ensure screen names match routes in app/ directory
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['bottom']}>
//       <View style={styles.bottomNav}>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigateToScreen("dashboard")}
//         >
//           <Icon name="compass" size={24} color={colors.heartblue} />
//           <Text style={styles.navText}>Discover</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigateToScreen("matches")}
//         >
//           <Icon name="heart" size={24} color={colors.heartblue} />
//           <Text style={styles.navText}>Matches</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigateToScreen("messages")}
//         >
//           <Icon name="comment" size={24} color={colors.heartblue} />
//           <Text style={styles.navText}>Messages</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigateToScreen("social")}
//         >
//           <Icon name="users" size={24} color={colors.heartblue} />
//           <Text style={styles.navText}>Social</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigateToScreen("mydata")}
//         >
//           <Icon name="user" size={24} color={colors.heartblue} />
//           <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 0,
//     backgroundColor: colors.secondary,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: colors.secondary,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: colors.background,
//     elevation: 10, // Adds shadow on Android
//     zIndex: 1000, // Ensures it stays above content
//     // Dynamically adjust height for Android navigation bar
//     minHeight: Platform.OS === 'android' ? 60 + (StatusBar.currentHeight || 0) : 60,
//   },
//   navItem: {
//     alignItems: "center",
//   },
//   navText: {
//     color: "#000000",
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

// export default  SocialFooter ;






// app/others/socialFooter.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, usePathname } from 'expo-router';

const palette = {
  bg: '#180F1F',
  surface: '#241729',
  border: 'rgba(245, 237, 228, 0.08)',
  textFaint: '#7C6A78',
  textPrimary: '#F5EDE4',
  sunsetStart: '#FF6F61',
  sunsetEnd: '#FFB86B',
};

const TABS = [
  { key: 'dashboard', label: 'Discover', icon: 'explore' },
  { key: 'matches', label: 'Matches', icon: 'favorite' },
  { key: 'messages', label: 'Messages', icon: 'chat-bubble' },
  // { key: 'social', label: 'Social', icon: 'groups' },
  { key: 'mydata', label: 'Profile', icon: 'person' },
];

const SocialFooter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToScreen = (screen) => router.push(`/${screen}`);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const active = pathname?.includes(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => navigateToScreen(tab.key)}
            >
              {active ? (
                <LinearGradient
                  colors={[palette.sunsetStart, palette.sunsetEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activePill}
                >
                  <Icon name={tab.icon} size={20} color={palette.bg} />
                </LinearGradient>
              ) : (
                <Icon name={tab.icon} size={22} color={palette.textFaint} />
              )}
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.bg,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    minWidth: 56,
  },
  activePill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: palette.textFaint,
    fontSize: 10.5,
    fontWeight: '600',
  },
  labelActive: {
    color: palette.textPrimary,
  },
});

export default SocialFooter;