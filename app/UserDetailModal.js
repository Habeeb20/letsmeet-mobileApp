// components/UserDetailModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUser } from '../constants/api';
import colors from '../colors';
import { getFollowers, followUser, unfollowUser } from '../constants/api';

const UserDetailModal = ({ visible, onClose, userId, currentUserId }) => {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      fetchUser();
      fetchFollowers();
    }
  }, [visible, userId]);

  const fetchUser = async () => {
    try {
      const response = await getUser(userId);
      setUser(response.data);
      // Check if following (assume backend returns or check via API)
      setIsFollowing(response.data.followers?.includes(currentUserId) || false);
    } catch (error) {
      console.error('Failed to fetch user');
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await getFollowers(userId);
      setFollowers(response.data);
    } catch (error) {
      console.error('Failed to fetch followers');
    }
  };

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <Image source={{ uri: user.profilePicture || 'https://via.placeholder.com/100' }} style={styles.profilePic} />
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.bio}>{user.bio || user.aboutMe?.join(' ')}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Age: {user.age}</Text>
            <Text>Gender: {user.gender}</Text>
            <Text>Location: {user.state}</Text>
            <Text>Education: {user.education}</Text>
            {/* Add more fields as needed */}
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {user.interests?.map((interest, idx) => <Text key={idx}>{interest}</Text>)}
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Followers ({followers.length})</Text>
            {followers.map((follower) => (
              <Text key={follower._id}>{follower.firstName} {follower.lastName}</Text>
            ))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btn, isFollowing && styles.unfollowBtn]} onPress={toggleFollow} disabled={loading || userId === currentUserId}>
            <Text style={styles.btnText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  btn: {
    flex: 1,
    backgroundColor: colors.heartblue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  unfollowBtn: {
    backgroundColor: colors.textSecondary,
  },
  btnText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 12,
  },
});

export default UserDetailModal;