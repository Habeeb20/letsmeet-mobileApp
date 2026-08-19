// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import colors from "./../colors"

// import { useNavigation } from "expo-router";
// import { useRouter } from "expo-router";

// const Onboarding3 = () => {
//   const router = useRouter();
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       <View style={styles.imageContainer}>
//         <Image
//           source={require("../assets/images/pictures1.jpeg")} // Left side image
//           style={[styles.sideImage, { left: -50 }]}
//         />
//         <Image
//           source={require("../assets/images/picture4.jpeg")} // Central image
//           style={styles.centralImage}
//         />
//         <Image
//           source={require("../assets/images/picture3.jpeg")} // Right side image
//           style={[styles.sideImage, { right: -50 }]}
//         />
//       </View>
//       <Text style={styles.title}>Premium</Text>
//       <Text style={styles.subtitle}>
//         Sign up today and enjoy the first month of premium benefits on us.
//       </Text>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate("signup")}
//       >
//         <Text style={styles.buttonText}>Create an account</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push("/signin")}>
//         <Text style={styles.link}>Already have an account? Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   imageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "relative",
//     width: "100%",
//     justifyContent: "center",
//   },
//   centralImage: {
//     width: 250,
//     height: 350,
//     resizeMode: "contain",
//   },
//   sideImage: {
//     width: 100,
//     height: 350,
//     resizeMode: "contain",
//     position: "absolute",
//     opacity: 0.5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: colors.textPrimary,
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: colors.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   link: {
//     color: colors.primary,
//     fontSize: 14,
//     textAlign: "center",
//   },
// });

// export default Onboarding3;







import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import colors from "./../colors";
import OnboardingDots from "./others/OnboardingDots";
const { width } = Dimensions.get("window");

const Onboarding3 = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/pictures1.jpeg")} style={[styles.sideImage, { left: 0 }]} />
        <Image source={require("../assets/images/picture4.jpeg")} style={styles.centralImage} />
        <Image source={require("../assets/images/picture3.jpeg")} style={[styles.sideImage, { right: 0 }]} />
        <LinearGradient colors={["transparent", colors.background]} style={styles.fade} />
      </View>

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PREMIUM</Text>
        </View>
        <Text style={styles.title}>Your first month, on us</Text>
        <Text style={styles.subtitle}>
          Sign up today and unlock premium benefits free for 30 days.
        </Text>

        <OnboardingDots total={3} activeIndex={2} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/signup")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signin")} style={styles.linkWrap}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: width * 1.0,
    position: "relative",
  },
  centralImage: { width: 220, height: 320, borderRadius: 24, resizeMode: "cover" },
  sideImage: {
    width: 110,
    height: 260,
    borderRadius: 20,
    resizeMode: "cover",
    position: "absolute",
    opacity: 0.35,
  },
  fade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 100 },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 8, alignItems: "center" },
  badge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: "700" },
  linkWrap: { marginTop: 16 },
  link: { color: colors.textSecondary, fontSize: 14, textAlign: "center" },
  linkBold: { color: colors.primary, fontWeight: "700" },
});

export default Onboarding3;