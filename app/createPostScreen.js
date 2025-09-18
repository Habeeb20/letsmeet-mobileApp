// app/createPost.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '../colors'; // Adjust to your path
import { createPost, editPost, deletePost, getFriends } from '../constants/api'; // Adjust to your path

import {uploadToCloudinary} from "./utils/cloudinary"
import SocialFooter from './others/socialFooter';
const CreatePostScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { postId, initialData } = params; // initialData might be string, parse if needed
  const parsedInitialData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;

  const [content, setContent] = useState(parsedInitialData?.content || '');
  const [media, setMedia] = useState(parsedInitialData?.media || []);
  const [tags, setTags] = useState(parsedInitialData?.tags || []);
  const [visibility, setVisibility] = useState(parsedInitialData?.visibility || 'public');
  const [categories, setCategories] = useState(parsedInitialData?.categories || []);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
       const storedToken = await AsyncStorage.getItem('token');
              if (!storedToken) {
                router.push('/signin');
                return;
              }
      const response = await getFriends(storedToken);
      setFriends(response.data || []); 
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load friends');
    }
  };

  const pickMedia = async (type = 'image') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setLoading(true);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri, type);
        setMedia([...media, { type, url, thumbnail: type === 'video' ? url : undefined }]);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to upload media');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      Alert.alert('Error', 'Post must have content or media');
      return;
    }
    setLoading(true);
    try {
      const postData = {
        content: content.trim(),
        media,
        tags: selectedFriends,
        visibility,
        categories: categories.length ? categories : undefined,
      };
      if (postId) {
        await editPost(postId, postData);
        Alert.alert('Success', 'Post updated');
      } else {
        await createPost(postData);
        Alert.alert('Success', 'Post created');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postId) return;
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deletePost(postId);
            Alert.alert('Success', 'Post deleted');
            router.back();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete post');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={styles.mediaContainer}>
        <FlatList
          data={media}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.mediaItem}>
              <Icon name={item.type === 'video' ? 'play-circle-outline' : 'image'} size={40} color={colors.heartblue} />
              <Text numberOfLines={1}>{item.url.split('/').pop()}</Text>
            </View>
          )}
          horizontal
        />
        <TouchableOpacity style={styles.addMediaBtn} onPress={() => pickMedia('image')}>
          <Icon name="add-photo-alternate" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addMediaBtn} onPress={() => pickMedia('video')}>
          <Icon name="videocam" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.tagBtn} onPress={() => setShowFriendsModal(true)}>
        <Icon name="person-add" size={20} color={colors.textSecondary} />
        <Text style={styles.tagText}>Tag Friends ({selectedFriends.length})</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={visibility}
        onValueChange={setVisibility}
        style={styles.picker}
      >
        <Picker.Item label="Public" value="public" />
        <Picker.Item label="Followers" value="followers" />
        <Picker.Item label="Private" value="private" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Categories (comma separated)"
        value={categories.join(', ')}
        onChangeText={(text) => setCategories(text.split(',').map((c) => c.trim()).filter((c) => c))}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{postId ? 'Update' : 'Post'}</Text>
      </TouchableOpacity>
      {postId && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Post</Text>
        </TouchableOpacity>
      )}

      {/* Friends Modal */}
      <Modal visible={showFriendsModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tag Friends</Text>
            <TouchableOpacity onPress={() => setShowFriendsModal(false)}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={friends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.friendItem,
                  selectedFriends.includes(item._id) && styles.selectedFriend,
                ]}
                onPress={() => toggleFriend(item._id)}
              >
                <Text>{item.firstName} {item.lastName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  
  },
  input: {
    backgroundColor: colors.secondary,
    padding: 12,
    marginTop:30,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaItem: {
    backgroundColor: colors.secondary,
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addMediaBtn: {
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginLeft: 8,
  },
  tagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagText: {
    marginLeft: 8,
    color: colors.textPrimary,
  },
  picker: {
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: colors.heartblue,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: colors.heart,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  friendItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  selectedFriend: {
    backgroundColor: colors.heartblue,
  },
});

export default CreatePostScreen;