import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getFriends, getChatHistory, sendMessage } from '../constants/api';
import colors from '../colors';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';

const Friends = () => {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          router.push('/signin');
          return;
        }
        setToken(storedToken);
        const response = await getFriends(storedToken);
        setFriends(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch friends');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const openChat = async (friend) => {
    setSelectedFriend(friend);
    try {
      const response = await getChatHistory(friend._id, token);
      setChatHistory(response.data);
    } catch (err) {
      setError('Failed to fetch chat history');
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedFriend && token) {
      try {
        const response = await sendMessage(selectedFriend._id, message, token);
        setChatHistory([...chatHistory, response.data.data]);
        setMessage('');
      } catch (err) {
        setError('Failed to send message');
      }
    }
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return (
    <View style={styles.container}>
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
        <Text style={styles.refreshButtonText}>Retry</Text>
      </TouchableOpacity>
      <Footer style={styles.localFooter} />
    </View>
  );

  return (
    <View style={styles.container}>
      {!selectedFriend ? (
        <>
          <Text style={styles.title}>Your Friends</Text>
          {friends.length > 0 ? (
            <FlatList
              data={friends}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.friendContainer} onPress={() => openChat(item)}>
                  <Image
                    source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
                    style={styles.friendImage}
                    defaultSource={require('../assets/images/alady.jpg')}
                  />
                  <Text style={styles.friendName}>{`${item.firstName} ${item.lastName}`}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noFriendsText}>No friends yet</Text>
          )}
        </>
      ) : (
        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>Chat with {`${selectedFriend.firstName} ${selectedFriend.lastName}`}</Text>
          <ScrollView style={styles.chatMessages}>
            {chatHistory.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sender._id === selectedFriend._id ? styles.receivedMessage : styles.sentMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedFriend(null)}>
            <Text style={styles.backButtonText}>Back to Friends</Text>
          </TouchableOpacity>
        </View>
      )}
      <Footer style={styles.localFooter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  noFriendsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  chatMessages: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'right',
    marginTop: 5,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#FF4D4D',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    textAlign: 'center',
    color: '#FF4D4D',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  refreshButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
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
});

export default Friends;