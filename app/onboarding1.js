// import React from "react";
// import colors from "./../colors"

// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { useNavigation } from "expo-router";
// import { useRouter } from "expo-router";

// const Onboarding1 = () => {
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
//           source={require("../assets/images/picture3.jpeg")} // Central image
//           style={styles.centralImage}
//         />
//         <Image
//           source={require("../assets/images/picture4.jpeg")} // Right side image
//           style={[styles.sideImage, { right: -50 }]}
//         />
//       </View>
//       <Text style={styles.title}>Algorithm</Text>
//       <Text style={styles.subtitle}>
//         Users going through a vetting process to ensure you never match with
//         bots.
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/onboarding2")}
//       >
//         <Text style={styles.buttonText}>Next</Text>
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
//     height: 150,
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
// });

// export default Onboarding1;





import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import colors from "./../colors";
import OnboardingDots from "./others/OnboardingDots";
const { width } = Dimensions.get("window");

const Onboarding1 = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => router.push("/signup")}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/pictures1.jpeg")} style={[styles.sideImage, { left: 0 }]} />
        <Image source={require("../assets/images/picture3.jpeg")} style={styles.centralImage} />
        <Image source={require("../assets/images/picture4.jpeg")} style={[styles.sideImage, { right: 0 }]} />
        <LinearGradient
          colors={["transparent", colors.background]}
          style={styles.fade}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Real people, not bots</Text>
        <Text style={styles.subtitle}>
          Every profile goes through a vetting process — so you're always matching with someone real.
        </Text>

        <OnboardingDots total={3} activeIndex={0} />

        <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding2")} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skip: { position: "absolute", top: 56, right: 24, zIndex: 10 },
  skipText: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
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
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 8 },
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: "700" },
});

export default Onboarding1;