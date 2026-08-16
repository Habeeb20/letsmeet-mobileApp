// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
// import { useRouter, usePathname } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// const NAV_ITEMS = [
//   { key: "dashboard", icon: "compass", label: "Discover", route: "/dashboard" },
//   { key: "matches", icon: "heart", label: "Matches", route: "/matches" },
//   { key: "messages", icon: "chatbubble-ellipses", label: "Messages", route: "/messages" },
//   { key: "feedScreen", icon: "people", label: "Social", route: "/feedScreen" },
//   { key: "mydata", icon: "person", label: "Profile", route: "/mydata" },
// ];

// const Footer = ({ active }) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   return (
//     <View style={styles.bottomBar}>
//       {NAV_ITEMS.map((item) => {
//         const isActive = active ? item.key === active : pathname?.includes(item.route);
//         return (
//           <TouchableOpacity
//             key={item.key}
//             style={styles.navItem}
//             onPress={() => router.push(item.route)}
//             activeOpacity={0.7}
//           >
//             {isActive ? (
//               <LinearGradient colors={["#FF6B6B", "#FF3D77"]} style={styles.navIconActive}>
//                 <Ionicons name={item.icon} size={19} color="#fff" />
//               </LinearGradient>
//             ) : (
//               <Ionicons name={`${item.icon}-outline`} size={22} color="#B5A3A3" />
//             )}
//             <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bottomBar: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#F3E4E2",
//     paddingTop: 10,
//     paddingBottom: Platform.select({ ios: 26, android: 14, default: 14 }),
//     paddingHorizontal: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     gap: 3,
//   },
//   navIconActive: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navLabel: {
//     fontSize: 10.5,
//     color: "#B5A3A3",
//     fontWeight: "600",
//   },
//   navLabelActive: {
//     color: "#FF3D77",
//   },
// });

// export default Footer;



import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const NAV_ITEMS = [
  { key: "dashboard", icon: "compass", label: "Discover", route: "/dashboard" },
  { key: "matches", icon: "heart", label: "Matches", route: "/matches" },
  { key: "messages", icon: "chatbubble-ellipses", label: "Messages", route: "/messages" },
  { key: "feedScreen", icon: "people", label: "Social", route: "/feedScreen" },
  { key: "mydata", icon: "person", label: "Profile", route: "/mydata" },
];

const Footer = ({ active }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.bottomBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = active ? item.key === active : pathname?.includes(item.route);
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
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3E4E2",
    paddingTop: 10,
    paddingBottom: 10,
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

export default Footer;