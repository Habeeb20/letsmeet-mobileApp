

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { getFriends, getChatHistory, sendMessage, getUserByEmail } from '../constants/api';
// import Footer from './others/Footer';
// import LoveLoader from './others/LoveLoader';
// import CustomError from './others/customError';
// import { Icon } from 'react-native-elements/dist/icons/Icon';
// import im from '../assets/images/alady.jpg';

// const Messages = () => {
//   const router = useRouter();
//   const [friends, setFriends] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [message, setMessage] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserIdAndFriends = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const storedToken = await AsyncStorage.getItem('authToken');
//         if (!storedToken) {
//           router.push('/signin');
//           return;
//         }
//         setToken(storedToken);

//         // Fetch user ID using email
//         const storedEmail = await AsyncStorage.getItem('userEmail');
//         if (!storedEmail) {
//           router.push('/signin');
//           return;
//         }
//         const userResponse = await getUserByEmail(storedEmail, storedToken);
//         if (userResponse.data) {
//           setUserId(userResponse.data.userId);
//         } else {
//           throw new Error(userResponse.message || 'Failed to fetch user ID');
//         }

//         // Fetch friends
//         const friendsResponse = await getFriends(storedToken);
//         setFriends(friendsResponse.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchUserIdAndFriends();
//   }, []);

//   const fetchChatHistory = async (friendId) => {
//     setChatLoading(true);
//     setError(null);
//     try {
//       const response = await getChatHistory(friendId, token);
//       setChatHistory(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch chat history');
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;
//     setChatLoading(true);
//     try {
//       const response = await sendMessage(selectedFriend._id, message, token);
//       console.log('Send message response:', response.data);
//       await fetchChatHistory(selectedFriend._id);
//       setMessage('');
//     } catch (err) {
//       console.error('Send message error:', err);
//       setError(err.response?.data?.message || 'Failed to send message');
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   const openChat = (friend) => {
//     setSelectedFriend(friend);
//     fetchChatHistory(friend._id);
//   };

//   const closeChat = () => {
//     setSelectedFriend(null);
//     setChatHistory([]);
//     setMessage('');
//   };

//   if (isLoading) return <LoveLoader visible={true} />;
//   if (error) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

//   return (
//     <View style={styles.container}>
//       <View style={styles.topNav}>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push('/newMessage')}
//         >
//           <Text style={styles.navText}>New</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push('/archived')}
//         >
//           <Icon name="archive" size={20} color="#FFFFFF" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => router.push('/settings')}
//         >
//           <Icon name="cog" size={20} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.title}>Messages</Text>
//       {friends.length > 0 ? (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => {
//             const lastMessage = item.lastMessages && item.lastMessages.length > 0 
//               ? item.lastMessages[item.lastMessages.length - 1].content 
//               : 'No messages yet';
//             return (
//               <TouchableOpacity
//                 style={styles.chatItem}
//                 onPress={() => openChat(item)}
//               >
//                 <Image
//                   source={item.profilePicture ? { uri: item.profilePicture } : im}
//                   style={styles.chatImage}
//                   defaultSource={im}
//                 />
//                 <View style={styles.chatDetails}>
//                   <Text style={styles.chatName}>{`${item.firstName} ${item.lastName}`}</Text>
//                   <Text style={styles.chatPreview}>{lastMessage}</Text>
//                 </View>
//                 <View style={styles.timeBadgeContainer}>
//                   <Text style={styles.timeText}>{item.lastMessageTime || '1 hour'}</Text>
//                   {item.unreadCount > 0 && (
//                     <View style={styles.unreadBadge}>
//                       <Text style={styles.unreadText}>{item.unreadCount}</Text>
//                     </View>
//                   )}
//                 </View>
//               </TouchableOpacity>
//             );
//           }}
//         />
//       ) : (
//         <Text style={styles.noFriendsText}>No friends to message</Text>
//       )}
//       {/* Chat Modal */}
//       <Modal
//         visible={!!selectedFriend}
//         animationType="slide"
//         onRequestClose={closeChat}
//       >
//         <View style={styles.chatModalContainer}>
//           <View style={styles.header}>
//             <Image
//               source={selectedFriend?.profilePicture ? { uri: selectedFriend.profilePicture } : im}
//               style={styles.headerImage}
//               defaultSource={im}
//             />
//             <Text style={styles.headerName}>{`${selectedFriend?.firstName} ${selectedFriend?.lastName}`}</Text>
//             <Text style={styles.headerStatus}>Online</Text>
//             <TouchableOpacity style={styles.headerClose} onPress={closeChat}>
//               <Icon name="close" size={24} color="#FF2E63" />
//             </TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={styles.chatModalContent}>
//             {chatLoading ? (
//               <LoveLoader visible={true} />
//             ) : error ? (
//               <CustomError message={error} onRetry={() => fetchChatHistory(selectedFriend._id)} />
//             ) : chatHistory.length > 0 ? (
//               chatHistory.map((msg) => (
//                 <View
//                   key={msg._id}
//                   style={[
//                     styles.messageBubble,
//                     msg.sender._id === userId ? styles.sentBubble : styles.receivedBubble,
//                   ]}
//                 >
//                   <Text style={[
//                     styles.messageText,
//                     msg.sender._id === userId ? styles.sentMessageText : styles.receivedMessageText
//                   ]}>
//                     {msg.content}
//                   </Text>
//                   <Text style={styles.messageTime}>{new Date(msg.createdAt).toLocaleTimeString()}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.noMessagesText}>check your messages</Text>
//             )}
//           </ScrollView>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.messageInput}
//               value={message}
//               onChangeText={setMessage}
//               placeholder="Type a message..."
//               placeholderTextColor="#757575"
//             />
//             <TouchableOpacity
//               style={styles.sendButton}
//               onPress={handleSendMessage}
//               disabled={chatLoading}
//             >
//               <Text style={styles.sendText}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       <Footer style={styles.localFooter} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 0,
//     marginTop: 0,
//   },
//   topNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#FF2E63',
//     paddingVertical: 10,
//     borderBottomWidth: 0,
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 15,
//     textAlign: 'left',
//     paddingHorizontal: 15,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     marginHorizontal: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   chatImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   chatDetails: {
//     flex: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     color: '#333333',
//     fontWeight: '500',
//   },
//   chatPreview: {
//     fontSize: 14,
//     color: '#757575',
//   },
//   timeBadgeContainer: {
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#757575',
//     marginBottom: 2,
//   },
//   unreadBadge: {
//     backgroundColor: '#FF2E63',
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   unreadText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   noFriendsText: {
//     fontSize: 16,
//     color: '#757575',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   localFooter: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#E0E0E0',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   chatModalContainer: {
//     flex: 1,
//     backgroundColor: '#E7D7D0',
//     padding: 0,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   headerImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   headerName: {
//     fontSize: 18,
//     color: '#333333',
//     fontWeight: '600',
//   },
//   headerStatus: {
//     fontSize: 12,
//     color: '#4CAF50',
//     marginLeft: 5,
//   },
//   headerClose: {
//     marginLeft: 'auto',
//   },
//   chatModalContent: {
//     flexGrow: 1,
//     paddingBottom: 70,
//     padding: 10,
//   },
//   messageBubble: {
//     maxWidth: '70%',
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   sentBubble: {
//     backgroundColor: '#FFD1DC',
//     alignSelf: 'flex-end',
//   },
//   receivedBubble: {
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'flex-start',
//   },
//   messageText: {
//     fontSize: 14,
//     color: '#333333',
//   },
//   sentMessageText: {
//     color: '#333333',
//   },
//   receivedMessageText: {
//     color: '#333333',
//   },
//   messageTime: {
//     fontSize: 10,
//     color: '#757575',
//     textAlign: 'right',
//     marginTop: 2,
//   },
//   noMessagesText: {
//     fontSize: 16,
//     color: '#757575',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },
//   messageInput: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 20,
//     padding: 10,
//     marginRight: 10,
//     color: '#333333',
//   },
//   sendButton: {
//     backgroundColor: '#FF2E63',
//     padding: 10,
//     borderRadius: 20,
//   },
//   sendText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// export default Messages;







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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  const openChat = (friend) => {
    setSelectedFriend(friend);
    fetchChatHistory(friend._id);
  };

  const closeChat = () => {
    setSelectedFriend(null);
    setChatHistory([]);
    setMessage('');
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error && !selectedFriend) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

  return (
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
          <TouchableOpacity onPress={() => router.push('/newMessage')}>
            <LinearGradient colors={['#FF6B6B', '#FF3D77']} style={styles.newBtn}>
              <Ionicons name="add" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conversation list */}
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const lastMessage =
              item.lastMessages?.length > 0
                ? item.lastMessages[item.lastMessages.length - 1].content
                : 'Say hello 👋';
            const unread = item.unreadCount > 0;
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
                      <Text style={styles.unreadText}>{item.unreadCount}</Text>
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