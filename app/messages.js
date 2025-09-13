// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { getFriends, getChatHistory, sendMessage } from '../constants/api';
// import colors from '../colors';
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
//   const [userId, setUserId] = useState(null); // To track logged-in user ID

//   useEffect(() => {
//     const fetchFriends = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const storedToken = await AsyncStorage.getItem('authToken');
//         if (!storedToken) {
//           router.push('/signin');
//           return;
//         }
//         setToken(storedToken);
//         const response = await getFriends(storedToken);
//         setFriends(response.data);
//         // Assuming user ID is part of the token or fetched with friends
//         const userData = await AsyncStorage.getItem('userData');
//         const parsedUserData = userData ? JSON.parse(userData) : {};
//         setUserId(parsedUserData.id || null);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch friends');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchFriends();
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
//               <Text style={styles.noMessagesText}>No messages yet</Text>
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

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getFriends, getChatHistory, sendMessage, getUserByEmail } from '../constants/api';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';
import CustomError from './others/customError';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import im from '../assets/images/alady.jpg';

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

        // Fetch user ID using email
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

        // Fetch friends
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
      const response = await sendMessage(selectedFriend._id, message, token);
      console.log('Send message response:', response.data);
      await fetchChatHistory(selectedFriend._id);
      setMessage('');
    } catch (err) {
      console.error('Send message error:', err);
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
  if (error) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/newMessage')}
        >
          <Text style={styles.navText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/archived')}
        >
          <Icon name="archive" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/settings')}
        >
          <Icon name="cog" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Messages</Text>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const lastMessage = item.lastMessages && item.lastMessages.length > 0 
              ? item.lastMessages[item.lastMessages.length - 1].content 
              : 'No messages yet';
            return (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => openChat(item)}
              >
                <Image
                  source={item.profilePicture ? { uri: item.profilePicture } : im}
                  style={styles.chatImage}
                  defaultSource={im}
                />
                <View style={styles.chatDetails}>
                  <Text style={styles.chatName}>{`${item.firstName} ${item.lastName}`}</Text>
                  <Text style={styles.chatPreview}>{lastMessage}</Text>
                </View>
                <View style={styles.timeBadgeContainer}>
                  <Text style={styles.timeText}>{item.lastMessageTime || '1 hour'}</Text>
                  {item.unreadCount > 0 && (
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
        <Text style={styles.noFriendsText}>No friends to message</Text>
      )}
      {/* Chat Modal */}
      <Modal
        visible={!!selectedFriend}
        animationType="slide"
        onRequestClose={closeChat}
      >
        <View style={styles.chatModalContainer}>
          <View style={styles.header}>
            <Image
              source={selectedFriend?.profilePicture ? { uri: selectedFriend.profilePicture } : im}
              style={styles.headerImage}
              defaultSource={im}
            />
            <Text style={styles.headerName}>{`${selectedFriend?.firstName} ${selectedFriend?.lastName}`}</Text>
            <Text style={styles.headerStatus}>Online</Text>
            <TouchableOpacity style={styles.headerClose} onPress={closeChat}>
              <Icon name="close" size={24} color="#FF2E63" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.chatModalContent}>
            {chatLoading ? (
              <LoveLoader visible={true} />
            ) : error ? (
              <CustomError message={error} onRetry={() => fetchChatHistory(selectedFriend._id)} />
            ) : chatHistory.length > 0 ? (
              chatHistory.map((msg) => (
                <View
                  key={msg._id}
                  style={[
                    styles.messageBubble,
                    msg.sender._id === userId ? styles.sentBubble : styles.receivedBubble,
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.sender._id === userId ? styles.sentMessageText : styles.receivedMessageText
                  ]}>
                    {msg.content}
                  </Text>
                  <Text style={styles.messageTime}>{new Date(msg.createdAt).toLocaleTimeString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMessagesText}>check your messages</Text>
            )}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#757575"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={chatLoading}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer style={styles.localFooter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginTop: 0,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FF2E63',
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'left',
    paddingHorizontal: 15,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  chatPreview: {
    fontSize: 14,
    color: '#757575',
  },
  timeBadgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  unreadBadge: {
    backgroundColor: '#FF2E63',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  noFriendsText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
  localFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: '#E7D7D0',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
  },
  headerClose: {
    marginLeft: 'auto',
  },
  chatModalContent: {
    flexGrow: 1,
    paddingBottom: 70,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentBubble: {
    backgroundColor: '#FFD1DC',
    alignSelf: 'flex-end',
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
  },
  sentMessageText: {
    color: '#333333',
  },
  receivedMessageText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: 10,
    color: '#757575',
    textAlign: 'right',
    marginTop: 2,
  },
  noMessagesText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: '#333333',
  },
  sendButton: {
    backgroundColor: '#FF2E63',
    padding: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Messages;