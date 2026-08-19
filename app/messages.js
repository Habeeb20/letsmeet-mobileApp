// app/messages.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getFriends, getChatHistory, sendMessage, getUserByEmail } from '../constants/api';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';
import CustomError from './others/customError';
import im from '../assets/images/alady.jpg';
import KeyboardSafeScreen from './others/KeyboardAvoidingView';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const Messages = () => {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newChatModalVisible, setNewChatModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserIdAndFriends = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          router.push('/signin');
          return;
        }
        setToken(storedToken);

        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (!storedEmail) {
          router.push('/signin');
          return;
        }
        const userResponse = await getUserByEmail(storedEmail, storedToken);
        if (userResponse.data) {
          setUserId(userResponse.data.userId);
        } else {
          throw new Error(userResponse.message || 'Failed to fetch user ID');
        }

        const friendsResponse = await getFriends(storedToken);
        setFriends(friendsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserIdAndFriends();
  }, []);

  const fetchChatHistory = async (friendId) => {
    setChatLoading(true);
    setError(null);
    try {
      const response = await getChatHistory(friendId, token);
      setChatHistory(response.data);

      // Clear the unread count locally once the chat has been opened/read
      setFriends((prev) =>
        prev.map((f) => (f._id === friendId ? { ...f, unreadCount: 0 } : f))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chat history');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setChatLoading(true);
    try {
      await sendMessage(selectedFriend._id, message, token);
      await fetchChatHistory(selectedFriend._id);
      setMessage('');

      // Optimistically bump this friend's lastMessages/lastMessageTime so the
      // list preview updates immediately without waiting for a refetch.
      setFriends((prev) =>
        prev.map((f) =>
          f._id === selectedFriend._id
            ? {
                ...f,
                lastMessages: [
                  ...(f.lastMessages || []),
                  { content: message, sender: { _id: userId }, createdAt: new Date().toISOString() },
                ],
                lastMessageTime: new Date().toISOString(),
              }
            : f
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  const openChat = (friend) => {
    setNewChatModalVisible(false);
    setSelectedFriend(friend);
    fetchChatHistory(friend._id);
  };

  const closeChat = () => {
    setSelectedFriend(null);
    setChatHistory([]);
    setMessage('');
  };

  // Friends sorted by most recent activity — used both for the list and for
  // suggesting who to start a new conversation with.
  const sortedFriends = [...friends].sort((a, b) => {
    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return bTime - aTime;
  });

  // Recent matches with no conversation started yet — shown in the "new chat" modal
  const friendsWithoutChat = sortedFriends.filter(
    (f) => !f.lastMessages || f.lastMessages.length === 0
  );
  const newChatSuggestions = (friendsWithoutChat.length > 0 ? friendsWithoutChat : sortedFriends).slice(0, 2);

  if (isLoading) return <LoveLoader visible={true} />;
  if (error && !selectedFriend) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

  return (
    <KeyboardSafeScreen style={{ padding: 20 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
              {friends.length ? `${friends.length} conversations` : 'Start a conversation'}
            </Text>
          </View>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/archived')}>
              <Ionicons name="archive-outline" size={19} color="#3D2C2E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={19} color="#3D2C2E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewChatModalVisible(true)}>
              <LinearGradient colors={['#FF6B6B', '#FF3D77']} style={styles.newBtn}>
                <Ionicons name="add" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conversation list */}
        {sortedFriends.length > 0 ? (
          <FlatList
            data={sortedFriends}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const lastMsgObj =
                item.lastMessages?.length > 0
                  ? item.lastMessages[item.lastMessages.length - 1]
                  : null;
              const isMine = lastMsgObj?.sender?._id === userId || lastMsgObj?.sender === userId;
              const lastMessage = lastMsgObj
                ? `${isMine ? 'You: ' : ''}${lastMsgObj.content}`
                : 'Say hello 👋';
              const unreadCount = item.unreadCount || 0;
              const unread = unreadCount > 0;
              return (
                <TouchableOpacity
                  style={styles.chatItem}
                  activeOpacity={0.7}
                  onPress={() => openChat(item)}
                >
                  <View style={styles.avatarWrap}>
                    <Image
                      source={item.profilePicture ? { uri: item.profilePicture } : im}
                      style={styles.chatImage}
                      defaultSource={im}
                    />
                    {item.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.chatDetails}>
                    <Text style={styles.chatName} numberOfLines={1}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text
                      style={[styles.chatPreview, unread && styles.chatPreviewUnread]}
                      numberOfLines={1}
                    >
                      {lastMessage}
                    </Text>
                  </View>
                  <View style={styles.timeBadgeContainer}>
                    <Text style={styles.timeText}>{timeAgo(item.lastMessageTime)}</Text>
                    {unread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#FF3D77" />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>Match with someone to start chatting</Text>
          </View>
        )}

        {/* New chat modal — pick who to start a conversation with */}
        <Modal
          visible={newChatModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setNewChatModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.newChatOverlay}
            activeOpacity={1}
            onPress={() => setNewChatModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.newChatSheet}>
              <View style={styles.newChatHandle} />
              <Text style={styles.newChatTitle}>Start a new conversation</Text>
              <Text style={styles.newChatSubtitle}>Who would you like to message?</Text>

              {newChatSuggestions.length > 0 ? (
                newChatSuggestions.map((friend) => (
                  <TouchableOpacity
                    key={friend._id}
                    style={styles.newChatItem}
                    activeOpacity={0.7}
                    onPress={() => openChat(friend)}
                  >
                    <Image
                      source={friend.profilePicture ? { uri: friend.profilePicture } : im}
                      style={styles.newChatImage}
                      defaultSource={im}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.newChatName}>
                        {friend.firstName} {friend.lastName}
                      </Text>
                      <Text style={styles.newChatHint}>Tap to start chatting</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#B5A3A3" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.newChatEmpty}>No matches available to message yet.</Text>
              )}

              <TouchableOpacity style={styles.newChatCancel} onPress={() => setNewChatModalVisible(false)}>
                <Text style={styles.newChatCancelText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Chat modal */}
        <Modal visible={!!selectedFriend} animationType="slide" onRequestClose={closeChat}>
          <KeyboardAvoidingView
            style={styles.chatModalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View style={styles.chatHeader}>
              <TouchableOpacity style={styles.chatBackBtn} onPress={closeChat}>
                <Ionicons name="arrow-back" size={20} color="#3D2C2E" />
              </TouchableOpacity>
              <Image
                source={selectedFriend?.profilePicture ? { uri: selectedFriend.profilePicture } : im}
                style={styles.headerImage}
                defaultSource={im}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.headerName} numberOfLines={1}>
                  {selectedFriend?.firstName} {selectedFriend?.lastName}
                </Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.headerStatus}>Online</Text>
                </View>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.chatModalContent}>
              {chatLoading && chatHistory.length === 0 ? (
                <LoveLoader visible={true} />
              ) : error ? (
                <CustomError message={error} onRetry={() => fetchChatHistory(selectedFriend._id)} />
              ) : chatHistory.length > 0 ? (
                chatHistory.map((msg) => {
                  const isMine = msg.sender._id === userId;
                  return (
                    <View
                      key={msg._id}
                      style={[styles.bubbleRow, isMine ? styles.bubbleRowSent : styles.bubbleRowReceived]}
                    >
                      {isMine ? (
                        <LinearGradient
                          colors={['#FF6B6B', '#FF3D77']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.messageBubble, styles.sentBubble]}
                        >
                          <Text style={styles.sentMessageText}>{msg.content}</Text>
                          <Text style={styles.sentMessageTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={[styles.messageBubble, styles.receivedBubble]}>
                          <Text style={styles.receivedMessageText}>{msg.content}</Text>
                          <Text style={styles.receivedMessageTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyChatState}>
                  <Ionicons name="chatbubble-outline" size={36} color="#F3B8C4" />
                  <Text style={styles.noMessagesText}>No messages yet — say hi!</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#B5A3A3"
                multiline
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={chatLoading || !message.trim()}
                style={{ opacity: chatLoading || !message.trim() ? 0.5 : 1 }}
              >
                <LinearGradient colors={['#FF6B6B', '#FF3D77']} style={styles.sendButton}>
                  <Ionicons name="send" size={17} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Footer active="chat" />
      </View>
    </KeyboardSafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 56 : 28,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D2C2E',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#8A7373',
    marginTop: 2,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3E4E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3E4E2',
  },
  avatarWrap: {
    position: 'relative',
  },
  chatImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 15,
    color: '#3D2C2E',
    fontWeight: '700',
  },
  chatPreview: {
    fontSize: 13,
    color: '#8A7373',
    marginTop: 2,
  },
  chatPreviewUnread: {
    color: '#3D2C2E',
    fontWeight: '600',
  },
  timeBadgeContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeText: {
    fontSize: 11.5,
    color: '#B5A3A3',
  },
  unreadBadge: {
    backgroundColor: '#FF3D77',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2C2E',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A7373',
    marginTop: 4,
    textAlign: 'center',
  },
  newChatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61,44,46,0.4)',
    justifyContent: 'flex-end',
  },
  newChatSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  newChatHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F3E4E2',
    alignSelf: 'center',
    marginBottom: 16,
  },
  newChatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2C2E',
    textAlign: 'center',
  },
  newChatSubtitle: {
    fontSize: 13,
    color: '#8A7373',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  newChatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  newChatImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  newChatName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D2C2E',
  },
  newChatHint: {
    fontSize: 12,
    color: '#8A7373',
    marginTop: 2,
  },
  newChatEmpty: {
    textAlign: 'center',
    color: '#8A7373',
    fontSize: 13.5,
    paddingVertical: 20,
  },
  newChatCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFF8F5',
  },
  newChatCancelText: {
    color: '#3D2C2E',
    fontWeight: '600',
    fontSize: 14,
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E4E2',
  },
  chatBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerName: {
    fontSize: 15.5,
    color: '#3D2C2E',
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  headerStatus: {
    fontSize: 11.5,
    color: '#8A7373',
  },
  chatModalContent: {
    flexGrow: 1,
    padding: 14,
    paddingBottom: 20,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  bubbleRowSent: {
    justifyContent: 'flex-end',
  },
  bubbleRowReceived: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  sentBubble: {
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3E4E2',
    borderBottomLeftRadius: 4,
  },
  sentMessageText: {
    fontSize: 14,
    color: '#fff',
  },
  receivedMessageText: {
    fontSize: 14,
    color: '#3D2C2E',
  },
  sentMessageTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    marginTop: 4,
  },
  receivedMessageTime: {
    fontSize: 10,
    color: '#B5A3A3',
    textAlign: 'right',
    marginTop: 4,
  },
  emptyChatState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  noMessagesText: {
    fontSize: 13.5,
    color: '#B5A3A3',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3E4E2',
    gap: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FFF8F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#3D2C2E',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#F3E4E2',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Messages;