import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ── Matches the coral/cream palette used across Dashboard, Messages,
// Matches, Visitors, LikedUsers, Favorite, Notifications ──
const CREAM = "#FFF8F5";
const PANEL = "#FFFFFF";
const BORDER = "#F3E4E2";
const CORAL_START = "#FF6B6B";
const CORAL_END = "#FF3D77";
const TEXT_PRIMARY = "#3D2C2E";
const TEXT_SECONDARY = "#8A7373";
const TEXT_FAINT = "#B5A3A3";
const BUBBLE_ASSISTANT = "#FFF3F1";
const ERROR = "#E8877A";
const ERROR_SOFT = "#FDEDEA";

const { height: SCREEN_H } = Dimensions.get("window");
const PANEL_HEIGHT = Math.min(SCREEN_H * 0.75, 620);

// TODO: point this at your actual dating-app AI backend, not the school one
const BASE_URL =  "https://ai-api-taskflow.edirect.ng/api";
const CHAT_ENDPOINT = `${BASE_URL}/public/chat`;

const SUGGESTED_QUESTIONS = [
  "Write me a short love poem for my match",
  "Help me craft a flirty opening message",
  "Give me a fun first-date idea",
  "How do I ask someone out over chat?",
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function getOrCreateSessionId() {
  const KEY = "letsmeet_ai_session_id";
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await AsyncStorage.setItem(KEY, id);
  }
  return id;
}

// bottomOffset: distance from the screen bottom, in px, so the FAB
// clears whichever footer nav the current screen uses. Pass this in
// per-screen if your footers differ in height.
export default function CupidAI({ bottomOffset = 90 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const sessionIdRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      sessionIdRef.current = await getOrCreateSessionId();
    })();
  }, []);

  useEffect(() => {
    if (isOpen) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isOpen]);

  const openPanel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOpen(true);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 180 }).start(
      () => setTimeout(() => inputRef.current?.focus(), 150)
    );
  };

  const closePanel = () => {
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setIsOpen(false)
    );
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  const handleCopy = async (text, index) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((c) => (c === index ? null : c)), 1500);
  };

  const fetchAIReply = async (userText) => {
    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ prompt: userText, session_id: sessionIdRef.current }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Request failed with status ${res.status}`);
    }

    if (!res.ok) throw new Error(data?.message || `Request failed with status ${res.status}`);

    const replyText = data?.data?.text ?? data?.reply ?? data?.message ?? data?.answer ?? null;
    if (data?.success === false) throw new Error(data?.message || "Chat request failed.");
    if (!replyText) throw new Error("Response did not include a recognizable reply.");

    return replyText;
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMessage = { role: "user", content: trimmed, time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);
    scrollToBottom();

    try {
      const replyText = await fetchAIReply(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", content: replyText, time: new Date() }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const opacity = anim;
  const fabOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const fabScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] });

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        pointerEvents={isOpen ? "none" : "auto"}
        style={{
          position: "absolute",
          bottom: 110,
          right: 20,
          opacity: fabOpacity,
          transform: [{ scale: fabScale }],
          zIndex: 60,
        }}
      >
        <Pressable onPress={openPanel}>
          <LinearGradient
            colors={[CORAL_START, CORAL_END]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: CORAL_END,
              shadowOpacity: 0.4,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 9,
                height: 9,
                borderRadius: 5,
                backgroundColor: "#FFD700",
                transform: [{ scale: pulse }],
              }}
            />
            <Ionicons name="heart" size={24} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Chat Panel */}
      {isOpen && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: bottomOffset - 66,
            right: 16,
            left: 16,
            height: PANEL_HEIGHT,
            opacity,
            transform: [{ translateY }],
            zIndex: 70,
          }}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: PANEL,
                borderRadius: 28,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: BORDER,
                shadowColor: "#4A2A3A",
                shadowOpacity: 0.25,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
                elevation: 16,
              }}
            >
              {/* Header */}
              <LinearGradient
                colors={[CORAL_START, CORAL_END]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 14,
                      backgroundColor: "rgba(255,255,255,0.25)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="heart-circle" size={22} color="#fff" />
                  </View>
                  <View>
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>Cupid AI</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#3FE0A0" }} />
                      <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>Your wingman, always here</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={closePanel}
                  hitSlop={10}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close" size={17} color="#fff" />
                </Pressable>
              </LinearGradient>

              {/* Messages */}
              <ScrollView
                ref={scrollRef}
                style={{ flex: 1, backgroundColor: CREAM }}
                contentContainerStyle={{ padding: 16, gap: 14 }}
                showsVerticalScrollIndicator={false}
              >
                {messages.length === 0 && (
                  <View style={{ gap: 14 }}>
                    <View style={{ alignItems: "center", paddingVertical: 12 }}>
                      <LinearGradient
                        colors={[CORAL_START, CORAL_END]}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 18,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Ionicons name="heart" size={26} color="#fff" />
                      </LinearGradient>
                      <Text style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: "700" }}>
                        Hey! Need a hand with someone special?
                      </Text>
                      <Text style={{ color: TEXT_SECONDARY, fontSize: 12, marginTop: 4, textAlign: "center" }}>
                        Ask me anything, or try one of these:
                      </Text>
                    </View>

                    <View style={{ gap: 8 }}>
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <Pressable
                          key={i}
                          onPress={() => sendMessage(q)}
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            borderRadius: 16,
                            backgroundColor: PANEL,
                            borderWidth: 1,
                            borderColor: BORDER,
                          }}
                        >
                          <Text style={{ color: TEXT_PRIMARY, fontSize: 13 }}>{q}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  const isCopied = copiedIndex === i;
                  return (
                    <View
                      key={i}
                      style={{ flexDirection: "row", justifyContent: isUser ? "flex-end" : "flex-start", gap: 8 }}
                    >
                      {!isUser && (
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: msg.isError ? ERROR : BUBBLE_ASSISTANT,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="heart" size={13} color={msg.isError ? "#fff" : CORAL_END} />
                        </View>
                      )}

                      <Pressable onLongPress={() => handleCopy(msg.content, i)} style={{ maxWidth: "78%" }}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: isUser ? "#FFB8C8" : TEXT_FAINT,
                            marginBottom: 3,
                            marginLeft: isUser ? 0 : 2,
                            textAlign: isUser ? "right" : "left",
                          }}
                        >
                          {isUser ? "You" : "Cupid AI"}
                        </Text>
                        <View
                          style={
                            isUser
                              ? {
                                  borderRadius: 18,
                                  borderBottomRightRadius: 4,
                                  overflow: "hidden",
                                }
                              : {
                                  paddingHorizontal: 14,
                                  paddingVertical: 10,
                                  borderRadius: 18,
                                  borderBottomLeftRadius: 4,
                                  backgroundColor: BUBBLE_ASSISTANT,
                                  borderWidth: 1,
                                  borderColor: msg.isError ? "#F3B0AA" : BORDER,
                                }
                          }
                        >
                          {isUser ? (
                            <LinearGradient
                              colors={[CORAL_START, CORAL_END]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            >
                              <Text style={{ fontSize: 13.5, lineHeight: 19, color: "#fff" }}>{msg.content}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={{ fontSize: 13.5, lineHeight: 19, color: TEXT_PRIMARY }}>{msg.content}</Text>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 3,
                            justifyContent: isUser ? "flex-end" : "flex-start",
                          }}
                        >
                          <Text style={{ fontSize: 9.5, color: TEXT_FAINT }}>{formatTime(msg.time)}</Text>
                          {isCopied && (
                            <Text style={{ fontSize: 9.5, color: "#3FAE7A", fontWeight: "600" }}>· Copied</Text>
                          )}
                        </View>
                      </Pressable>

                      {isUser && (
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: CORAL_END,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="person" size={13} color="#fff" />
                        </View>
                      )}
                    </View>
                  );
                })}

                {isLoading && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: BUBBLE_ASSISTANT,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="heart" size={13} color={CORAL_END} />
                    </View>
                    <View
                      style={{
                        backgroundColor: BUBBLE_ASSISTANT,
                        borderWidth: 1,
                        borderColor: BORDER,
                        borderRadius: 18,
                        borderBottomLeftRadius: 4,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                      }}
                    >
                      <ActivityIndicator size="small" color={CORAL_END} />
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Error banner */}
              {error && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: ERROR_SOFT,
                    borderTopWidth: 1,
                    borderTopColor: "#F3C6BE",
                  }}
                >
                  <Text style={{ color: ERROR, fontSize: 11, flex: 1 }}>{error}</Text>
                  <Pressable onPress={() => setError(null)} hitSlop={8}>
                    <Text style={{ color: ERROR, fontSize: 11, fontWeight: "700" }}>Dismiss</Text>
                  </Pressable>
                </View>
              )}

              {/* Input */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: BORDER,
                  backgroundColor: PANEL,
                }}
              >
                <TextInput
                  ref={inputRef}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Ask Cupid anything..."
                  placeholderTextColor={TEXT_FAINT}
                  editable={!isLoading}
                  onSubmitEditing={() => sendMessage(input)}
                  returnKeyType="send"
                  style={{
                    flex: 1,
                    backgroundColor: CREAM,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    color: TEXT_PRIMARY,
                    fontSize: 13.5,
                    borderWidth: 1,
                    borderColor: BORDER,
                  }}
                />
                <Pressable onPress={() => sendMessage(input)} disabled={isLoading || !input.trim()}>
                  <LinearGradient
                    colors={input.trim() && !isLoading ? [CORAL_START, CORAL_END] : ["#E8D5D5", "#E8D5D5"]}
                    style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons name="send" size={16} color="#fff" />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </>
  );
}