// app/_layout.js
import { Stack, useRouter } from "expo-router";
import { View, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import LoveLoader from "./others/LoveLoader"

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setIsAuthenticated(true);
          router.replace("/dashboard");
        } else {
          router.replace("/signin");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/signin");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // if (isLoading) return <LoveLoader visible={true} />;

  return (
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
      
      <Stack.Screen name="visitorScreen" options={{ headerShown: false }} />


    </Stack>
  );
}
