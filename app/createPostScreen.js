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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createPost, editPost, deletePost, getFriends } from '../constants/api'; // Adjust to your path
import { uploadToCloudinary } from './utils/cloudinary';

// ── Design tokens ────────────────────────────────────────────────
// A late-evening palette instead of the usual pink/red dating-app cliché:
// deep plum background, warm sunset gradient as the single accent gesture,
// dusty rose for secondary chips. Feel free to fold this into a shared
// theme file — kept local here so this screen has its own identity.
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

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: 'public' },
  { value: 'followers', label: 'Followers', icon: 'group' },
  { value: 'private', label: 'Private', icon: 'lock' },
];

const initials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?';

const CreatePostScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { postId, initialData } = params;
  const parsedInitialData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;

  const [content, setContent] = useState(parsedInitialData?.content || '');
  const [media, setMedia] = useState(parsedInitialData?.media || []);
  const [visibility, setVisibility] = useState(parsedInitialData?.visibility || 'public');
  const [categories, setCategories] = useState(parsedInitialData?.categories || []);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
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
      setMediaUploading(true);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri, type);
        setMedia([...media, { type, url, thumbnail: type === 'video' ? url : undefined }]);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to upload media');
      } finally {
        setMediaUploading(false);
      }
    }
  };

  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
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
    Alert.alert('Delete this moment?', 'This can\u2019t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(postId);
            Alert.alert('Deleted', 'Your moment was removed');
            router.back();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete post');
          }
        },
      },
    ]);
  };

  const canSubmit = (content.trim().length > 0 || media.length > 0) && !loading;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Icon name="arrow-back-ios-new" size={18} color={palette.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{postId ? 'Edit moment' : 'New moment'}</Text>
          <Text style={styles.headerSubtitle}>Share something real</Text>
        </View>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Composer card */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="What's the moment?"
            placeholderTextColor={palette.textFaint}
            value={content}
            onChangeText={setContent}
            multiline
          />

          {/* Media strip */}
          <View style={styles.mediaRow}>
            <TouchableOpacity
              style={styles.addMediaBtn}
              onPress={() => pickMedia('image')}
              disabled={mediaUploading}
            >
              <Icon name="add-photo-alternate" size={20} color={palette.rose} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMediaBtn}
              onPress={() => pickMedia('video')}
              disabled={mediaUploading}
            >
              <Icon name="videocam" size={20} color={palette.rose} />
            </TouchableOpacity>

            {mediaUploading && (
              <View style={styles.mediaChip}>
                <Text style={styles.mediaChipText}>Uploading\u2026</Text>
              </View>
            )}

            <FlatList
              data={media}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingLeft: 4 }}
              renderItem={({ item, index }) => (
                <View style={styles.mediaChip}>
                  <Icon
                    name={item.type === 'video' ? 'play-circle-outline' : 'image'}
                    size={16}
                    color={palette.textSecondary}
                  />
                  <Text style={styles.mediaChipText} numberOfLines={1}>
                    {item.url.split('/').pop()}
                  </Text>
                  <TouchableOpacity onPress={() => removeMedia(index)} hitSlop={8}>
                    <Icon name="close" size={14} color={palette.textFaint} />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>

        {/* Tag friends */}
        <TouchableOpacity style={styles.rowCard} onPress={() => setShowFriendsModal(true)}>
          <View style={styles.rowCardLeft}>
            <View style={styles.rowIconWrap}>
              <Icon name="person-add-alt" size={18} color={palette.rose} />
            </View>
            <View>
              <Text style={styles.rowCardTitle}>Tag people</Text>
              <Text style={styles.rowCardSubtitle}>
                {selectedFriends.length ? `${selectedFriends.length} tagged` : 'No one tagged yet'}
              </Text>
            </View>
          </View>

          {selectedFriends.length > 0 ? (
            <View style={styles.avatarStack}>
              {selectedFriends.slice(0, 3).map((id, i) => {
                const friend = friends.find((f) => f._id === id);
                return (
                  <View key={id} style={[styles.avatarSmall, { marginLeft: i === 0 ? 0 : -10 }]}>
                    <Text style={styles.avatarSmallText}>
                      {friend ? initials(friend.firstName, friend.lastName) : '?'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Icon name="chevron-right" size={22} color={palette.textFaint} />
          )}
        </TouchableOpacity>

        {/* Visibility segmented control */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Who can see this</Text>
          <View style={styles.segmentRow}>
            {VISIBILITY_OPTIONS.map((opt) => {
              const active = visibility === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setVisibility(opt.value)}
                  style={[styles.segment, active && styles.segmentActive]}
                >
                  <Icon
                    name={opt.icon}
                    size={16}
                    color={active ? palette.bg : palette.textSecondary}
                  />
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Categories</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="e.g. travel, food, music"
            placeholderTextColor={palette.textFaint}
            value={categories.join(', ')}
            onChangeText={(text) => setCategories(text.split(',').map((c) => c.trim()).filter((c) => c))}
          />
          {categories.length > 0 && (
            <View style={styles.chipWrap}>
              {categories.map((c, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{c}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {postId && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Icon name="delete-outline" size={18} color={palette.danger} />
            <Text style={styles.deleteText}>Delete moment</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky submit */}
      <View style={styles.submitBar}>
        <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit} disabled={!canSubmit}>
          <LinearGradient
            colors={canSubmit ? [palette.sunsetStart, palette.sunsetEnd] : ['#3A2C3F', '#3A2C3F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            <Text style={[styles.submitText, !canSubmit && { color: palette.textFaint }]}>
              {loading ? 'Sharing\u2026' : postId ? 'Save changes' : 'Share moment'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Friends Modal */}
      <Modal visible={showFriendsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tag people</Text>
              <TouchableOpacity onPress={() => setShowFriendsModal(false)} hitSlop={8}>
                <Icon name="close" size={22} color={palette.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={friends}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Your friends will show up here.</Text>
              }
              renderItem={({ item }) => {
                const selected = selectedFriends.includes(item._id);
                return (
                  <TouchableOpacity
                    style={[styles.friendItem, selected && styles.friendItemSelected]}
                    onPress={() => toggleFriend(item._id)}
                  >
                    <View style={[styles.avatar, selected && styles.avatarSelected]}>
                      <Text style={styles.avatarText}>{initials(item.firstName, item.lastName)}</Text>
                    </View>
                    <Text style={styles.friendName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    {selected && (
                      <View style={styles.checkBadge}>
                        <Icon name="check" size={14} color={palette.bg} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowFriendsModal(false)}>
              <LinearGradient
                colors={[palette.sunsetStart, palette.sunsetEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.doneBtn}
              >
                <Text style={styles.submitText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: palette.textFaint,
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  input: {
    color: palette.textPrimary,
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  inputSmall: {
    color: palette.textPrimary,
    fontSize: 14,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addMediaBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.surfaceRaised,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: 140,
  },
  mediaChipText: {
    color: palette.textSecondary,
    fontSize: 12,
    flexShrink: 1,
  },
  rowCard: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCardTitle: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  rowCardSubtitle: {
    color: palette.textFaint,
    fontSize: 12,
    marginTop: 2,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.rose,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.surface,
  },
  avatarSmallText: {
    color: palette.bg,
    fontSize: 10,
    fontWeight: '700',
  },
  sectionLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: palette.surfaceRaised,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: palette.rose,
  },
  segmentText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: palette.bg,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: palette.roseSoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagChipText: {
    color: palette.rose,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.dangerSoft,
    borderRadius: 18,
    paddingVertical: 14,
  },
  deleteText: {
    color: palette.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  submitBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 18,
    backgroundColor: palette.bg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  submitBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: palette.bg,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 6, 12, 0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: palette.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  emptyText: {
    color: palette.textFaint,
    textAlign: 'center',
    paddingVertical: 30,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 4,
  },
  friendItemSelected: {
    backgroundColor: palette.surface,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: palette.rose,
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  friendName: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default CreatePostScreen;