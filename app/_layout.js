
// // app/_layout.js
// import { Stack, useRouter, usePathname } from "expo-router";
// import { useState, useEffect, useRef } from "react";
// import LoveLoader from "./others/LoveLoader";
// import CupidAI from "./others/CupidAI";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import {registerUnauthorizedHandler} from "../constants/api"
// const HIDDEN_ON = [
//   "/", "/index", "/onboarding1", "/onboarding2", "/onboarding3",
//   "/signup", "/signin", "/emailinput", "/codeverification", "/loginToken",
// ];

// export default function Layout() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const hasCheckedAuth = useRef(false);

//   useEffect(() => {
//     if (hasCheckedAuth.current) return;
//     hasCheckedAuth.current = true;

//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem("authToken");
//         if (token) {
//           setIsAuthenticated(true);
//           router.replace("/dashboard");
//         } else {
//           router.replace("/onboarding1");
//         }
//       } catch (err) {
//         console.error("Auth check error:", err);
//         router.replace("/signin");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     checkAuth();
//   }, []); // ← empty array, same as your original — runs once on mount, full stop

//   // if (isLoading) return <LoveLoader visible={true} />;

//   const showCupidAI = isAuthenticated && !HIDDEN_ON.includes(pathname);

//   return (
//     <>
//     <SafeAreaProvider>
//    <Stack>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
//         <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
//         <Stack.Screen name="onboarding3" options={{ headerShown: false }} />
//         <Stack.Screen name="signup" options={{ headerShown: false }} />
//         <Stack.Screen name="signin" options={{ headerShown: false }} />
//         <Stack.Screen name="emailinput" options={{ headerShown: false }} />
//         <Stack.Screen name="codeverification" options={{ headerShown: false }} />
//         <Stack.Screen name="profile" options={{ headerShown: false }} />
//         <Stack.Screen name="gender" options={{ headerShown: false }} />
//         <Stack.Screen name="interests" options={{ headerShown: false }} />
//         <Stack.Screen name="phone" options={{ headerShown: false }} />
//         <Stack.Screen name="loginToken" options={{ headerShown: false }} />
//         <Stack.Screen name="dashboard" options={{ headerShown: false }} />
//         <Stack.Screen name="matches" options={{ headerShown: false }} />
//         <Stack.Screen name="messages" options={{ headerShown: false }} />
//         <Stack.Screen name="social" options={{ headerShown: false }} />
//         <Stack.Screen name="mydata" options={{ headerShown: false }} />
//         <Stack.Screen name="discover" options={{ headerShown: false }} />
//         <Stack.Screen name="editprofile" options={{ headerShown: false }} />
//         <Stack.Screen name="likedBy" options={{ headerShown: false }} />
//         <Stack.Screen name="friends" options={{ headerShown: false }} />
//         <Stack.Screen name="likedusers" options={{ headerShown: false }} />
//         <Stack.Screen name="favorite" options={{ headerShown: false }} />
//         <Stack.Screen name="visitorScreen" options={{ headerShown: false }} />
//         <Stack.Screen name="feedScreen" options={{ headerShown: false }} />
//         <Stack.Screen name="createPostScreen" options={{ headerShown: false }} />
//       </Stack>

//       {showCupidAI && <CupidAI />}
//     </SafeAreaProvider>
   
//     </>
//   );
// }









// app/_layout.js
import { Stack, useRouter, usePathname } from "expo-router";
import { useState, useEffect, useRef } from "react";
import LoveLoader from "./others/LoveLoader";
import CupidAI from "./others/CupidAI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerUnauthorizedHandler } from "../constants/api";

const HIDDEN_ON = [
  "/", "/index", "/onboarding1", "/onboarding2", "/onboarding3",
  "/signup", "/signin", "/emailinput", "/codeverification", "/loginToken",
];

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Register the 401 handler once, on mount — independent of auth-check timing
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setIsAuthenticated(false);
      router.replace("/signin");
    });
  }, []);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setIsAuthenticated(true);
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding1");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/signin");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []); // ← empty array, same as your original — runs once on mount, full stop

  // if (isLoading) return <LoveLoader visible={true} />;

  const showCupidAI = isAuthenticated && !HIDDEN_ON.includes(pathname);

  return (
    <>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding3" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="emailinput" options={{ headerShown: false }} />
          <Stack.Screen name="codeverification" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="gender" options={{ headerShown: false }} />
          <Stack.Screen name="interests" options={{ headerShown: false }} />
          <Stack.Screen name="phone" options={{ headerShown: false }} />
          <Stack.Screen name="loginToken" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="matches" options={{ headerShown: false }} />
          <Stack.Screen name="messages" options={{ headerShown: false }} />
          <Stack.Screen name="social" options={{ headerShown: false }} />
          <Stack.Screen name="mydata" options={{ headerShown: false }} />
          <Stack.Screen name="discover" options={{ headerShown: false }} />
          <Stack.Screen name="editprofile" options={{ headerShown: false }} />
          <Stack.Screen name="likedBy" options={{ headerShown: false }} />
          <Stack.Screen name="friends" options={{ headerShown: false }} />
          <Stack.Screen name="likedusers" options={{ headerShown: false }} />
          <Stack.Screen name="favorite" options={{ headerShown: false }} />
          <Stack.Screen name="visitorScreen" options={{ headerShown: false }} />
          <Stack.Screen name="feedScreen" options={{ headerShown: false }} />
          <Stack.Screen name="createPostScreen" options={{ headerShown: false }} />
        </Stack>

        {showCupidAI && <CupidAI />}
      </SafeAreaProvider>
    </>
  );
}





