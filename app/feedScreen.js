
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   Modal,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import colors from '../colors'; // Adjust path
// import { getAllPosts, likePost, sharePost, savePost, trackPostView, getFeed } from '../constants/api'; // Adjust path
// import UserDetailModal from './UserDetailModal'; // Adjust path
// import CommentsModal from './commentModal'; // Adjust path
// import SocialFooter from './others/socialFooter'; // Adjust path

// const FeedScreen = () => {
//   const router = useRouter();
//   const [posts, setPosts] = useState([]);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showCommentsModal, setShowCommentsModal] = useState(false);
//   const [showMenuModal, setShowMenuModal] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     const initialize = async () => {
//       const storedToken = await AsyncStorage.getItem('authToken');
//       if (!storedToken) {
//         router.push('/signin');
//         return;
//       }
//       setCurrentUserId('current_user_id_placeholder'); // Replace with actual user ID from auth
//       fetchFeed();
//     };
//     initialize();
//   }, []);

//   const fetchFeed = async () => {
//     try {
//       const response = await getFeed();
//       setPosts(response.data || []);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to load posts');
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchFeed();
//     setRefreshing(false);
//   };

//   const handleLike = async (postId) => {
//     try {
//       const response = await likePost(postId);
//       setPosts((prev) => prev.map((p) => (p._id === postId ? response.data : p)));
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to like post');
//     }
//   };

//   const handleShare = async (postId) => {
//     try {
//       await sharePost(postId);
//       Alert.alert('Shared', 'Post shared successfully');
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to share post');
//     }
//   };

//   const handleSave = async (postId) => {
//     try {
//       await savePost(postId);
//       Alert.alert('Saved', 'Post saved');
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to save post');
//     }
//   };

//   const handleHide = async (postId) => {
//     // Implement hide logic (e.g., API call to mark post as hidden)
//     try {
//       // Assuming an API endpoint exists, e.g., PUT /api/posts/:postId/hide
//       const token = await AsyncStorage.getItem('authToken');
//       await api.put(`/api/posts/${postId}/hide`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts((prev) => prev.filter((p) => p._id !== postId));
//       Alert.alert('Hidden', 'Post hidden');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to hide post');
//     }
//   };

//   const handleReport = async (postId) => {
//     // Implement report logic (e.g., API call)
//     try {
//       // Assuming an API endpoint exists, e.g., POST /api/posts/:postId/report
//       const token = await AsyncStorage.getItem('authToken');
//       await api.post(`/api/posts/${postId}/report`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       Alert.alert('Reported', 'Post reported');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to report post');
//     }
//   };

//   const handleViewPost = async (post) => {
//     try {
//       await trackPostView(post._id);
//       setSelectedPost(post);
//     } catch (error) {
//       console.error('View tracking error:', error);
//     }
//   };

//   const renderPost = ({ item: post }) => (
//     <View style={styles.postContainer}>
//       <TouchableOpacity
//         style={styles.header}
//         onPress={() => {
//           setSelectedUserId(post.author._id);
//           setShowUserModal(true);
//         }}
//       >
//         <Image
//           source={{ uri: post.author.profilePicture || 'https://via.placeholder.com/40' }}
//           style={styles.avatar}
//         />
//         <View style={styles.userInfo}>
//           <Text style={styles.username}>{post.author.firstName} {post.author.lastName}</Text>
//           <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.followBtn}
//           onPress={() => {
//             setSelectedUserId(post.author._id);
//             setShowUserModal(true);
//           }}
//         >
//           <Text style={styles.followText}>Follow</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.menuBtn}
//           onPress={() => {
//             setSelectedPost(post);
//             setShowMenuModal(true);
//           }}
//         >
//           <Icon name="more-vert" size={24} color={colors.textSecondary} />
//         </TouchableOpacity>
//       </TouchableOpacity>
//       <Text style={styles.content}>{post.content}</Text>
//       {post.media && post.media.map((m, idx) => (
//         <Image key={idx} source={{ uri: m.url }} style={styles.media} />
//       ))}
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post._id)}>
//           <Icon name="favorite" size={24} color={colors.heartblue} />
//           <Text style={styles.actionText}>{post.likes.length}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionBtn}
//           onPress={() => {
//             setSelectedPost(post);
//             setShowCommentsModal(true);
//           }}
//         >
//           <Icon name="chat-bubble-outline" size={24} color={colors.textSecondary} />
//           <Text style={styles.actionText}>{post.comments.length}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(post._id)}>
//           <Icon name="share" size={24} color={colors.textSecondary} />
//           <Text style={styles.actionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//       {/* <SocialFooter /> */}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderPost}
//         onRefresh={onRefresh}
//         refreshing={refreshing}
//         ListHeaderComponent={
//           <TouchableOpacity
//             style={styles.createBtn}
//             onPress={() => router.push('/createPostScreen')}
//           >
//             <Icon name="add" size={24} color={colors.buttonText} />
//             <Text style={styles.createText}>Create Post</Text>
//           </TouchableOpacity>
//         }
//       />
//       <UserDetailModal
//         visible={showUserModal}
//         onClose={() => setShowUserModal(false)}
//         userId={selectedUserId}
//         currentUserId={currentUserId}
//       />
//       <CommentsModal
//         visible={showCommentsModal}
//         onClose={() => setShowCommentsModal(false)}
//         postId={selectedPost?._id}
//       />
//       <Modal visible={showMenuModal} transparent animationType="fade">
//         <View style={styles.menuOverlay}>
//           <View style={styles.menu}>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => {
//                 handleSave(selectedPost?._id);
//                 setShowMenuModal(false);
//               }}
//             >
//               <Icon name="bookmark" size={20} color={colors.textPrimary} />
//               <Text style={styles.menuText}>Save Post</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => {
//                 handleHide(selectedPost?._id);
//                 setShowMenuModal(false);
//               }}
//             >
//               <Icon name="visibility-off" size={20} color={colors.textPrimary} />
//               <Text style={styles.menuText}>Hide Post</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => {
//                 handleReport(selectedPost?._id);
//                 setShowMenuModal(false);
//               }}
//             >
//               <Icon name="flag" size={20} color={colors.heart} />
//               <Text style={styles.menuText}>Report Post</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       <SocialFooter />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   createBtn: {
//     flexDirection: 'row',
//     backgroundColor: colors.heartblue,
//     padding: 16,
//     alignItems: 'center',
//     margin: 16,
//     marginTop: 50,
//     borderRadius: 8,
//   },
//   createText: {
//     color: colors.buttonText,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   postContainer: {
//     backgroundColor: colors.background, // Changed from colors.white to colors.background
//     margin: 8,
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   username: {
//     fontWeight: 'bold',
//     color: colors.textPrimary,
//     fontSize: 16,
//   },
//   timestamp: {
//     color: colors.textSecondary,
//     fontSize: 12,
//   },
//   followBtn: {
//     backgroundColor: colors.heartblue,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   followText: {
//     color: colors.buttonText,
//     fontSize: 12,
//   },
//   menuBtn: {
//     padding: 4,
//   },
//   content: {
//     color: colors.textPrimary,
//     fontSize: 16,
//     lineHeight: 24,
//     marginBottom: 12,
//   },
//   media: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 8,
//   },
//   actionBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//   },
//   actionText: {
//     marginLeft: 4,
//     color: colors.textSecondary,
//   },
//   menuOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   menu: {
//     backgroundColor: colors.background,
//     width: 200,
//     borderRadius: 8,
//     margin: 16,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.secondary,
//   },
//   menuText: {
//     marginLeft: 12,
//     color: colors.textPrimary,
//   },
// });

// export default FeedScreen;






// app/FeedScreen.jsx
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
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  getFeed,
  likePost,
  sharePost,
  savePost,
  trackPostView,
  api, // default axios instance — adjust if your api.js exports differently
} from '../constants/api';
import UserDetailModal from './UserDetailModal';
import CommentsModal from './commentModal';
import SocialFooter from './others/socialFooter';

// ── Design tokens (shared with createPost.jsx) ──────────────────
const palette = {
  bg: '#180F1F',
  surface: '#241729',
  surfaceRaised: '#2E1B34',
  border: 'rgba(245, 237, 228, 0.08)',
  textPrimary: '#F5EDE4',
  textSecondary: '#B8A2B0',
  textFaint: '#7C6A78',
  rose: '#E8A0BF',
  roseSoft: 'rgba(232, 160, 191, 0.14)',
  danger: '#FF6F71',
  dangerSoft: 'rgba(255, 111, 113, 0.14)',
  sunsetStart: '#FF6F61',
  sunsetEnd: '#FFB86B',
};

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const initials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?';

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
      setCurrentUserId('current_user_id_placeholder');
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
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.put(
        `/api/posts/${postId}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      Alert.alert('Hidden', 'Post hidden');
    } catch (error) {
      Alert.alert('Error', 'Failed to hide post');
    }
  };

  const handleReport = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.post(
        `/api/posts/${postId}/report`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => {
            setSelectedUserId(post.author._id);
            setShowUserModal(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: post.author.profilePicture || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>
              {post.author.firstName} {post.author.lastName}
            </Text>
            <Text style={styles.timestamp}>{timeAgo(post.createdAt)} ago</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              setSelectedUserId(post.author._id);
              setShowUserModal(true);
            }}
          >
            <LinearGradient
              colors={[palette.sunsetStart, palette.sunsetEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.followBtn}
            >
              <Text style={styles.followText}>Follow</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuBtn}
            hitSlop={8}
            onPress={() => {
              setSelectedPost(post);
              setShowMenuModal(true);
            }}
          >
            <Icon name="more-vert" size={20} color={palette.textFaint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {!!post.content && <Text style={styles.content}>{post.content}</Text>}

      {post.media && post.media.length > 0 && (
        <View style={styles.mediaWrap}>
          {post.media.map((m, idx) => (
            <Image key={idx} source={{ uri: m.url }} style={styles.media} />
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post._id)}>
          <Icon name="favorite-border" size={20} color={palette.rose} />
          <Text style={styles.actionText}>{post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setSelectedPost(post);
            setShowCommentsModal(true);
          }}
        >
          <Icon name="chat-bubble-outline" size={20} color={palette.textSecondary} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(post._id)}>
          <Icon name="share" size={20} color={palette.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.iconOnlyBtn} onPress={() => handleSave(post._id)}>
          <Icon name="bookmark-border" size={20} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.feedTitle}>Moments</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/createPostScreen')}
            >
              <LinearGradient
                colors={[palette.sunsetStart, palette.sunsetEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createBtn}
              >
                <Icon name="add" size={20} color={palette.bg} />
                <Text style={styles.createText}>Share a moment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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

      {/* Post menu — bottom sheet, matches createPost's friends modal */}
      <Modal visible={showMenuModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenuModal(false)}
        >
          <View style={styles.menuSheet}>
            <View style={styles.modalHandle} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleSave(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <View style={styles.menuIconWrap}>
                <Icon name="bookmark" size={18} color={palette.rose} />
              </View>
              <Text style={styles.menuText}>Save post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleHide(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <View style={styles.menuIconWrap}>
                <Icon name="visibility-off" size={18} color={palette.rose} />
              </View>
              <Text style={styles.menuText}>Hide post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleReport(selectedPost?._id);
                setShowMenuModal(false);
              }}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: palette.dangerSoft }]}>
                <Icon name="flag" size={18} color={palette.danger} />
              </View>
              <Text style={[styles.menuText, { color: palette.danger }]}>Report post</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <SocialFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  feedTitle: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
    paddingTop: Platform => 24,
    marginTop: 24,
    marginBottom: 14,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 18,
  },
  createText: {
    color: palette.bg,
    fontWeight: '800',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  avatarRing: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: palette.rose,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '700',
    color: palette.textPrimary,
    fontSize: 14,
  },
  timestamp: {
    color: palette.textFaint,
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  followText: {
    color: palette.bg,
    fontSize: 12,
    fontWeight: '700',
  },
  menuBtn: {
    padding: 6,
  },
  content: {
    color: palette.textPrimary,
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 12,
  },
  mediaWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    gap: 6,
  },
  media: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: palette.surfaceRaised,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 10,
    gap: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconOnlyBtn: {
    padding: 2,
  },
  actionText: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 6, 12, 0.7)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: palette.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: palette.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FeedScreen;