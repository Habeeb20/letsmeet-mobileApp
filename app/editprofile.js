import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';
import { updateProfile } from '../constants/api';
import { withKeyboardAvoiding } from './utils/keyboardAvoiding';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../constants/api';

// ─── Design tokens ──────────────────────────────────────────────────────────
// A warm, editorial palette built for the app rather than a stock "dating red".
// Deep wine anchors trust + intimacy; peach-coral carries the energy of the CTA.
const palette = {
  bg: '#FBF3EF',            // warm ivory canvas
  surface: '#FFFFFF',
  surfaceMuted: '#FCEFEA',
  wine: '#7A2E45',          // primary / headlines / selected state
  wineDeep: '#5A1F33',
  coral: '#F2665A',         // CTA accent
  coralSoft: '#FFD9CE',
  gold: '#E7A854',          // small highlight accent (used sparingly)
  textPrimary: '#2B1C22',
  textSecondary: '#8C7A80',
  textOnDark: '#FBF3EF',
  border: '#F0DED9',
  divider: '#EFE1DC',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CLOUDINARY_UPLOAD_PRESET = 'essential';
const CLOUDINARY_API_KEY = '624216876378923';
const CLOUDINARY_CLOUD_NAME = 'dc0poqt9l';

const SECTION_META = {
  interests: { label: 'Interests', icon: 'sparkles-outline', helper: 'Pick what lights you up' },
  aboutMe: { label: 'About me', icon: 'person-outline', helper: 'How would friends describe you?' },
  myFaith: { label: 'Faith', icon: 'moon-outline', helper: 'Optional, but helps great matches' },
  personality: { label: 'Personality', icon: 'color-palette-outline', helper: 'Your natural energy' },
  languages: { label: 'Languages', icon: 'globe-outline', helper: 'What do you speak at home?' },
  ethnicity: { label: 'Background', icon: 'earth-outline', helper: 'Share as much as you like' },
};

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: '',
    interests: [],
    aboutMe: [],
    myFaith: [],
    personality: [],
    languages: [],
    ethnicity: [],
    age: '',
    bio: '',
    education: '',
    contactsFiltered: [],
    notificationsEnabled: false,
    gallery: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          router.push('/signin');
          return;
        }
        const response = await api.get('/api/auth/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleInputChange = (name, value) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setUser((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to update your pictures.');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (field) => {
    setLoading(true);
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result || result.canceled) return;
      if (!result.assets || result.assets.length === 0) {
        throw new Error('No image data returned from picker.');
      }

      const file = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.fileName || `profile-${Date.now()}.jpg`,
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('timestamp', Math.round(Date.now() / 1000));

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const resultData = await res.json();
      if (resultData.error) throw new Error(resultData.error.message);
      setUser((prev) => ({ ...prev, [field]: resultData.secure_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Upload failed', 'Could not upload your photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = async () => {
    setLoading(true);
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result || result.canceled) return;
      if (!result.assets || result.assets.length === 0) {
        throw new Error('No image data returned from picker.');
      }

      const uploadPromises = result.assets.map((file) => {
        const formData = new FormData();
        formData.append('file', {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          type: file.mimeType || 'image/jpeg',
          name: file.fileName || `gallery-${Date.now()}.jpg`,
        });
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('timestamp', Math.round(Date.now() / 1000));
        return fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }
        ).then((r) => r.json());
      });

      const responses = await Promise.all(uploadPromises);
      const urls = responses.filter((r) => !r.error).map((r) => r.secure_url);
      if (responses.some((r) => r.error)) {
        Alert.alert('Partial upload', 'Some photos could not be uploaded.');
      }
      setUser((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
    } catch (error) {
      console.error('Gallery upload failed:', error);
      Alert.alert('Upload failed', 'Could not upload your photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setUser((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.push('/signin');
        return;
      }
      await updateProfile(user, token);
      Alert.alert('Saved', 'Your profile is up to date.');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Update failed', 'Could not save your changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ['Photography', 'Shopping', 'Karaoke', 'Yoga', 'Cooking', 'Tennis', 'Running', 'Swimming', 'Art', 'Traveling', 'Extreme Sports', 'Music', 'Dancing', 'Video Games', 'Reading', 'Hiking', 'Camping', 'Fitness', 'Movies', 'Foodie', 'Writing', 'Gardening', 'Skiing', 'Surfing', 'Board Games'];
  const aboutMeOptions = ['Adventurous', 'Creative', 'Funny', 'Kind', 'Outgoing', 'Thoughtful', 'Ambitious', 'Easygoing', 'Romantic', 'Intellectual', 'Spontaneous', 'Loyal', 'Empathetic', 'Curious', 'Optimistic'];
  const myFaithOptions = ['Christianity', 'Islam', 'Buddhism', 'Hinduism', 'Judaism', 'Sikhism', 'Atheism', 'Agnosticism', 'Spiritual', 'Other'];
  const personalityOptions = ['Introvert', 'Extrovert', 'Ambitious', 'Calm', 'Optimistic', 'Analytical', 'Creative', 'Adventurous', 'Organized', 'Spontaneous', 'Empathetic', 'Confident', 'Humorous', 'Relaxed', 'Driven'];
  const languagesOptions = ['English', 'Spanish', 'French', 'Arabic', 'Swahili', 'Mandarin', 'Hindi', 'Portuguese', 'Russian', 'German', 'Japanese', 'Korean', 'Italian', 'Yoruba', 'Igbo', 'Hausa', 'Bengali', 'Urdu', 'Dutch', 'Thai'];
  const ethnicityOptions = ['African', 'Asian', 'Caucasian', 'Hispanic', 'Mixed', 'Native American', 'Middle Eastern', 'South Asian', 'Pacific Islander', 'Caribbean', 'Latino', 'Indigenous', 'Other'];

  const chipFieldGroups = [
    { field: 'interests', options: interestOptions },
    { field: 'aboutMe', options: aboutMeOptions },
    { field: 'myFaith', options: myFaithOptions },
    { field: 'personality', options: personalityOptions },
    { field: 'languages', options: languagesOptions },
    { field: 'ethnicity', options: ethnicityOptions },
  ];

  const genderOptions = [
    { label: 'Woman', value: 'female' },
    { label: 'Man', value: 'male' },
    { label: 'Other', value: 'other' },
  ];

  return withKeyboardAvoiding(
    <View style={styles.container}>
      {loading && <LoveLoader />}

      {/* Header */}
      <LinearGradient colors={[palette.wine, palette.wineDeep]} style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={palette.textOnDark} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>YOUR PROFILE</Text>
          <Text style={styles.headerTitle}>Edit profile</Text>
        </View>
        <View style={styles.headerIconButton} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.avatarBlock}>
          <View style={styles.avatarRingWrap}>
            <LinearGradient
              colors={[palette.coral, palette.wine]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                {user.profilePicture ? (
                  <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color={palette.textSecondary} />
                )}
              </View>
            </LinearGradient>
            <TouchableOpacity
              style={styles.avatarEditBadge}
              onPress={() => handleImageUpload('profilePicture')}
            >
              <Ionicons name="camera" size={16} color={palette.textOnDark} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>
            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Add your name'}
          </Text>
          <Text style={styles.avatarHint}>Tap the camera to change your photo</Text>
        </Animated.View>

        {/* Basic info card */}
        <Animated.View entering={FadeInUp.duration(450)} style={styles.card}>
          <Text style={styles.cardTitle}>Basic information</Text>

          <View style={styles.rowSplit}>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>First name</Text>
              <TextInput
                style={styles.input}
                value={user.firstName}
                onChangeText={(t) => handleInputChange('firstName', t)}
                placeholder="Jane"
                placeholderTextColor={palette.textSecondary}
              />
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Last name</Text>
              <TextInput
                style={styles.input}
                value={user.lastName}
                onChangeText={(t) => handleInputChange('lastName', t)}
                placeholder="Doe"
                placeholderTextColor={palette.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(t) => handleInputChange('email', t)}
            placeholder="you@example.com"
            placeholderTextColor={palette.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={user.phoneNumber}
            onChangeText={(t) => handleInputChange('phoneNumber', t)}
            placeholder="+234 800 000 0000"
            placeholderTextColor={palette.textSecondary}
            keyboardType="phone-pad"
          />

          <View style={styles.rowSplit}>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Date of birth</Text>
              <TextInput
                style={styles.input}
                value={user.dateOfBirth}
                onChangeText={(t) => handleInputChange('dateOfBirth', t)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={palette.textSecondary}
              />
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={user.age}
                onChangeText={(t) => handleInputChange('age', t)}
                placeholder="27"
                placeholderTextColor={palette.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.segmentGroup}>
            {genderOptions.map((opt) => {
              const active = user.gender === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segmentOption, active && styles.segmentOptionActive]}
                  onPress={() => handleInputChange('gender', opt.value)}
                >
                  <Text style={[styles.segmentOptionText, active && styles.segmentOptionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* About card */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
          <Text style={styles.cardTitle}>About you</Text>

          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={user.bio}
            onChangeText={(t) => handleInputChange('bio', t)}
            placeholder="Tell people what makes you, you..."
            placeholderTextColor={palette.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>Education</Text>
          <TextInput
            style={styles.input}
            value={user.education}
            onChangeText={(t) => handleInputChange('education', t)}
            placeholder="University of Lagos"
            placeholderTextColor={palette.textSecondary}
          />
        </Animated.View>

        {/* Chip sections */}
        {chipFieldGroups.map(({ field, options }) => {
          const meta = SECTION_META[field];
          return (
            <Animated.View entering={FadeInUp.duration(500)} key={field} style={styles.card}>
              <View style={styles.cardTitleRow}>
                <View style={styles.cardTitleIconWrap}>
                  <Ionicons name={meta.icon} size={16} color={palette.wine} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{meta.label}</Text>
                  <Text style={styles.cardSubtitle}>{meta.helper}</Text>
                </View>
                {user[field].length > 0 && (
                  <View style={styles.countPill}>
                    <Text style={styles.countPillText}>{user[field].length}</Text>
                  </View>
                )}
              </View>
              <FlatList
                data={options}
                horizontal
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
                renderItem={({ item }) => {
                  const active = user[field].includes(item);
                  return (
                    <TouchableOpacity
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => handleArrayChange(field, item)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </Animated.View>
          );
        })}

        {/* Gallery */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardTitleIconWrap}>
              <Ionicons name="images-outline" size={16} color={palette.wine} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Photo gallery</Text>
              <Text style={styles.cardSubtitle}>Show more of your world</Text>
            </View>
          </View>

          <View style={styles.galleryGrid}>
            {user.gallery.map((item, index) => (
              <View key={`gallery-${index}`} style={styles.galleryTile}>
                <Image source={{ uri: item }} style={styles.galleryImage} />
                <TouchableOpacity
                  style={styles.galleryRemove}
                  onPress={() => handleRemoveGalleryImage(index)}
                >
                  <Ionicons name="close" size={14} color={palette.textOnDark} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.galleryAddTile} onPress={handleGalleryUpload}>
              <Ionicons name="add" size={26} color={palette.wine} />
              <Text style={styles.galleryAddText}>Add photos</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Sticky save bar */}
      <View style={styles.saveBar}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleSubmit}>
          <LinearGradient
            colors={[palette.coral, palette.wine]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Footer style={styles.footer} />
    </View>,
    {
      behavior: Platform.OS === 'ios' ? 'padding' : 'height',
      keyboardVerticalOffset: Platform.OS === 'ios' ? 120 : 100,
      style: { flex: 1, backgroundColor: palette.bg },
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 140,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: palette.wineDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { alignItems: 'center' },
  eyebrow: {
    color: 'rgba(251,243,239,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    color: palette.textOnDark,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },

  // Avatar
  avatarBlock: { alignItems: 'center', marginBottom: 8, marginTop: 4 },
  avatarRingWrap: { width: 108, height: 108, marginBottom: 12 },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.wine,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.bg,
  },
  avatarName: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.textPrimary,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
  avatarHint: {
    fontSize: 12.5,
    color: palette.textSecondary,
    marginTop: 3,
    marginBottom: 6,
  },

  // Cards
  card: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#3A1421',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  cardTitleIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPill: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.wine,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countPillText: { color: palette.textOnDark, fontSize: 11.5, fontWeight: '700' },

  // Fields
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  rowSplit: { flexDirection: 'row', gap: 12 },
  fieldHalf: { flex: 1 },
  input: {
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 15,
    color: palette.textPrimary,
  },
  textArea: { minHeight: 96, paddingTop: 12 },

  // Segmented gender control
  segmentGroup: {
    flexDirection: 'row',
    backgroundColor: palette.surfaceMuted,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  segmentOptionActive: {
    backgroundColor: palette.wine,
  },
  segmentOptionText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  segmentOptionTextActive: { color: palette.textOnDark },

  // Chips
  chipRow: { gap: 9, paddingRight: 6 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: {
    backgroundColor: palette.wine,
    borderColor: palette.wine,
  },
  chipText: { fontSize: 13.5, fontWeight: '600', color: palette.textPrimary },
  chipTextActive: { color: palette.textOnDark },

  // Gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryTile: {
    width: (SCREEN_WIDTH - 18 * 2 - 18 * 2 - 10 * 2) / 3,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  galleryImage: { width: '100%', height: '100%' },
  galleryRemove: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(43,28,34,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryAddTile: {
    width: (SCREEN_WIDTH - 18 * 2 - 18 * 2 - 10 * 2) / 3,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: palette.wine,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceMuted,
    gap: 4,
  },
  galleryAddText: { fontSize: 10.5, fontWeight: '600', color: palette.wine },

  // Save bar
  saveBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: Platform.OS === 'ios' ? 96 : 84,
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: palette.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  saveButtonText: {
    color: palette.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: palette.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  footerSpacer: { height: 60 },
});

export default EditProfile;