// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
// import { FontAwesome, AntDesign } from "@expo/vector-icons";
// import colors from "./../colors";
// import { useRouter } from "expo-router";

// const SignUp = () => {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <View style={styles.top}>
//         <Image
//           source={require("../assets/images/datingLogo.jpeg")}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>Find your match</Text>
//         <Text style={styles.subtitle}>
//           Sign up to start meeting real people near you.
//         </Text>
//       </View>

//       <View style={styles.bottom}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/emailinput")}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.buttonText}>Continue with email</Text>
//         </TouchableOpacity>

//         <View style={styles.dividerRow}>
//           <View style={styles.divider} />
//           <Text style={styles.dividerText}>or continue with</Text>
//           <View style={styles.divider} />
//         </View>

//         <View style={styles.socialContainer}>
//           <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
//             <FontAwesome name="facebook" size={22} color="#1877F2" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
//             <AntDesign name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
//             <AntDesign name="apple1" size={22} color={colors.textPrimary} />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={() => router.push("/signin")}>
//           <Text style={styles.signinLink}>
//             Already have an account? <Text style={styles.signinBold}>Sign In</Text>
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.terms}>
//           By continuing, you agree to our{" "}
//           <Text style={styles.termsLink}>Terms of Use</Text> and{" "}
//           <Text style={styles.termsLink}>Privacy Policy</Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     justifyContent: "space-between",
//     paddingHorizontal: 28,
//     paddingTop: 80,
//     paddingBottom: 32,
//   },
//   top: {
//     alignItems: "center",
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: colors.textPrimary,
//     textAlign: "center",
//     marginBottom: 10,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: colors.textSecondary,
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   bottom: {
//     width: "100%",
//   },
//   button: {
//     backgroundColor: colors.primary,
//     paddingVertical: 17,
//     borderRadius: 28,
//     alignItems: "center",
//     width: "100%",
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   buttonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 24,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: colors.textSecondary + "30",
//   },
//   dividerText: {
//     color: colors.textSecondary,
//     fontSize: 13,
//     marginHorizontal: 12,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 28,
//   },
//   socialButton: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: colors.background,
//     borderWidth: 1,
//     borderColor: colors.textSecondary + "25",
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   signinLink: {
//     color: colors.textSecondary,
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   signinBold: {
//     color: colors.primary,
//     fontWeight: "700",
//   },
//   terms: {
//     color: colors.textSecondary,
//     fontSize: 12,
//     textAlign: "center",
//     lineHeight: 18,
//   },
//   termsLink: {
//     textDecorationLine: "underline",
//     color: colors.textSecondary,
//   },
// });

// export default SignUp;







import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import colors from "./../colors";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require("../assets/images/datingLogo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Find your match</Text>
        <Text style={styles.subtitle}>
          Sign up to start meeting real people near you.
        </Text>

        <View style={styles.animationWrapper}>
          <LottieView
            source={require("../assets/images/Social media react animation.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/emailinput")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue with email</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          {/* <Text style={styles.dividerText}>or continue with</Text> */}
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <AntDesign name="apple1" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/signin")}>
          <Text style={styles.signinLink}>
            Already have an account? <Text style={styles.signinBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Use</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 32,
  },
  top: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  animationWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  animation: {
    width: 220,
    height: 220,
  },
  bottom: {
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 17,
    borderRadius: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary + "30",
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary + "25",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  signinLink: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  signinBold: {
    color: colors.primary,
    fontWeight: "700",
  },
  terms: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: "underline",
    color: colors.textSecondary,
  },
});

export default SignUp;