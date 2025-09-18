
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import colors from '../colors'; // Adjust path
import { getAllPosts, likePost, sharePost, savePost, trackPostView, getFeed } from '../constants/api'; // Adjust path
import UserDetailModal from './UserDetailModal'; // Adjust path
import CommentsModal from './commentModal'; // Adjust path
import SocialFooter from './others/socialFooter'; // Adjust path

const FeedScreen = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        router.push('/signin');
        return;
      }
      setCurrentUserId('current_user_id_placeholder'); // Replace with actual user ID from auth
      fetchFeed();
    };
    initialize();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await getFeed();
      setPosts(response.data || []);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load posts');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);
      setPosts((prev) => prev.map((p) => (p._id === postId ? response.data : p)));
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleShare = async (postId) => {
    try {
      await sharePost(postId);
      Alert.alert('Shared', 'Post shared successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to share post');
    }
  };

  const handleSave = async (postId) => {
    try {
      await savePost(postId);
      Alert.alert('Saved', 'Post saved');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save post');
    }
  };

  const handleHide = async (postId) => {
    // Implement hide logic (e.g., API call to mark post as hidden)
    try {
      // Assuming an API endpoint exists, e.g., PUT /api/posts/:postId/hide
      const token = await AsyncStorage.getItem('authToken');
      await api.put(`/api/posts/${postId}/hide`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      Alert.alert('Hidden', 'Post hidden');
    } catch (error) {
      Alert.alert('Error', 'Failed to hide post');
    }
  };

  const handleReport = async (postId) => {
    // Implement report logic (e.g., API call)
    try {
      // Assuming an API endpoint exists, e.g., POST /api/posts/:postId/report
      const token = await AsyncStorage.getItem('authToken');
      await api.post(`/api/posts/${postId}/report`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Reported', 'Post reported');
    } catch (error) {
      Alert.alert('Error', 'Failed to report post');
    }
  };

  const handleViewPost = async (post) => {
    try {
      await trackPostView(post._id);
      setSelectedPost(post);
    } catch (error) {
      console.error('View tracking error:', error);
    }
  };

  const renderPost = ({ item: post }) => (
    <View style={styles.postContainer}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          setSelectedUserId(post.author._id);
          setShowUserModal(true);
        }}
      >
        <Image
          source={{ uri: post.author.profilePicture || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.author.firstName} {post.author.lastName}</Text>
          <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.followBtn}
          onPress={() => {
            setSelectedUserId(post.author._id);
            setShowUserModal(true);
          }}
        >
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            setSelectedPost(post);
            setShowMenuModal(true);
          }}
        >
          <Icon name="more-vert" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={styles.content}>{post.content}</Text>
      {post.media && post.media.map((m, idx) => (
        <Image key={idx} source={{ uri: m.url }} style={styles.media} />
      ))}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post._id)}>
          <Icon name="favorite" size={24} color={colors.heartblue} />
          <Text style={styles.actionText}>{post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setSelectedPost(post);
            setShowCommentsModal(true);
          }}
        >
          <Icon name="chat-bubble-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(post._id)}>
          <Icon name="share" size={24} color={colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      {/* <SocialFooter /> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/createPostScreen')}
          >
            <Icon name="add" size={24} color={colors.buttonText} />
            <Text style={styles.createText}>Create Post</Text>
          </TouchableOpacity>
        }
      />
      <UserDetailModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        userId={selectedUserId}
        currentUserId={currentUserId}
      />
      <CommentsModal
        visible={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postId={selectedPost?._id}
      />
      <Modal visible={showMenuModal} transparent animationType="fade">
        <View style={styles.menuOverlay}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleSave(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <Icon name="bookmark" size={20} color={colors.textPrimary} />
              <Text style={styles.menuText}>Save Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleHide(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <Icon name="visibility-off" size={20} color={colors.textPrimary} />
              <Text style={styles.menuText}>Hide Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleReport(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <Icon name="flag" size={20} color={colors.heart} />
              <Text style={styles.menuText}>Report Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SocialFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  createBtn: {
    flexDirection: 'row',
    backgroundColor: colors.heartblue,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    marginTop: 50,
    borderRadius: 8,
  },
  createText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  postContainer: {
    backgroundColor: colors.background, // Changed from colors.white to colors.background
    margin: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontSize: 16,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  followBtn: {
    backgroundColor: colors.heartblue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  followText: {
    color: colors.buttonText,
    fontSize: 12,
  },
  menuBtn: {
    padding: 4,
  },
  content: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    color: colors.textSecondary,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: colors.background,
    width: 200,
    borderRadius: 8,
    margin: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  menuText: {
    marginLeft: 12,
    color: colors.textPrimary,
  },
});

export default FeedScreen;
