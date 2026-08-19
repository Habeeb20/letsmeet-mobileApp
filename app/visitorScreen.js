import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../constants/api';
import LoveLoader from './others/LoveLoader';
import Footer from './others/Footer';
import im from '../assets/images/alady.jpg';
import SubNav from './others/SubNav';

const { width } = Dimensions.get('window');
const TAG_COLORS = ['#FFE4E1', '#FFF3D6', '#E1F0FF', '#E8F7EC', '#F3E1FF'];

const TagRow = ({ title, items, emptyText }) => (
  <View style={{ marginTop: 14 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items?.length > 0 ? (
      <FlatList
        data={items}
        horizontal
        keyExtractor={(item, i) => `${title}-${i}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.tag, { backgroundColor: TAG_COLORS[index % TAG_COLORS.length] }]}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        )}
      />
    ) : (
      <Text style={styles.emptyText}>{emptyText}</Text>
    )}
  </View>
);

const VisitorsScreen = () => {
  const router = useRouter();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchVisitors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          router.push('/signin');
          return;
        }
        setToken(storedToken);
        const visitorsResponse = await api.get('/api/dating/visitors', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setVisitors(visitorsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch visitors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const logVisit = async (userId) => {
    try {
      if (userId && token) {
        await api.post(
          '/api/users/visit',
          { profileId: userId },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error('Failed to log visit:', err);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    logVisit(user._id);
  };

  const Screen = ({ children }) => (
    <View style={styles.container}>
      <View style={styles.body}>{children}</View>
      <Footer active="dashboard" />
    </View>
  );

  if (isLoading) return <LoveLoader visible={true} />;

  if (error) {
    return (
      <Screen>
        <View style={styles.centerScreen}>
          <Ionicons name="alert-circle-outline" size={40} color="#E8877A" />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={() => setIsLoading(true)} style={styles.buttonShadow}>
            <LinearGradient colors={['#FF6B6B', '#FF3D77']} style={styles.button}>
              <Text style={styles.buttonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
     <View style={styles.topBar}>
  <Text style={styles.title}>Profile Visitors</Text>
  <Text style={styles.subtitle}>
    {visitors.length ? `${visitors.length} people checked you out` : 'See who\u2019s been by'}
  </Text>
</View>
<SubNav active="visited" />

      {visitors.length > 0 ? (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.visitorCard} onPress={() => viewUserDetails(item)} activeOpacity={0.85}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : im}
                style={styles.visitorImage}
                defaultSource={im}
              />
              <Text style={styles.visitorName} numberOfLines={1}>
                {item.firstName} {item.lastName}
              </Text>
              {!!item.age && <Text style={styles.visitorMeta}>{item.age} yrs</Text>}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.centerScreen}>
          <Ionicons name="eye-outline" size={48} color="#FF3D77" />
          <Text style={styles.noUsersText}>No Visitors Yet</Text>
          <Text style={styles.noUsersSubText}>Keep exploring to attract more visitors to your profile!</Text>
        </View>
      )}

      <Modal visible={!!selectedUser} animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {selectedUser && (
              <>
                <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalBackButton}>
                  <Ionicons name="arrow-back" size={22} color="#3D2C2E" />
                </TouchableOpacity>

                <Image
                  source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : im}
                  style={styles.modalProfileImage}
                  defaultSource={im}
                />
                <Text style={styles.modalName}>{selectedUser.firstName} {selectedUser.lastName}</Text>
                <Text style={styles.modalMeta}>
                  {selectedUser.age ? `${selectedUser.age} \u00b7 ` : ''}
                  {selectedUser.state || 'Location not specified'}
                </Text>

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.bodyText}>{selectedUser.bio || 'No bio available'}</Text>

                  <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Education</Text>
                  <Text style={styles.bodyText}>{selectedUser.education || 'Not specified'}</Text>

                  <TagRow title="About Me" items={selectedUser.aboutMe} emptyText="No info available" />
                  <TagRow title="Interests" items={selectedUser.interests} emptyText="No interests available" />
                  <TagRow title="Languages" items={selectedUser.languages} emptyText="No languages available" />
                  <TagRow title="Personality" items={selectedUser.personality} emptyText="No personality info available" />

                  <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Gallery</Text>
                  {selectedUser.gallery?.length > 0 ? (
                    <View style={styles.galleryGrid}>
                      {selectedUser.gallery.map((url, i) => (
                        <Image key={i} source={{ uri: url }} style={styles.galleryImage} defaultSource={im} />
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyText}>No gallery images</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedUser(null)}
                  style={[styles.buttonShadow, { alignSelf: 'center', marginTop: 20 }]}
                >
                  <LinearGradient colors={['#FF6B6B', '#FF3D77']} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F5' },
  body: { flex: 1 },
  topBar: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#3D2C2E' },
  subtitle: { fontSize: 12.5, color: '#8A7373', marginTop: 2 },
  grid: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24, gap: 12 },
  visitorCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3E4E2',
  },
  visitorImage: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#FF3D77', marginBottom: 8 },
  visitorName: { fontSize: 13.5, fontWeight: '700', color: '#3D2C2E' },
  visitorMeta: { fontSize: 11.5, color: '#8A7373', marginTop: 2 },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  noUsersText: { fontSize: 18, fontWeight: 'bold', color: '#3D2C2E', marginTop: 12 },
  noUsersSubText: { fontSize: 13, color: '#8A7373', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  error: { fontSize: 14, color: '#E8877A', fontWeight: '600', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  buttonShadow: {
    borderRadius: 999,
    shadowColor: '#FF3D77',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  button: { paddingVertical: 13, paddingHorizontal: 34, borderRadius: 999 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: '#FFF8F5' },
  modalBackButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#F3E4E2',
  },
  modalProfileImage: { width: 130, height: 130, borderRadius: 65, alignSelf: 'center', borderWidth: 3, borderColor: '#FF3D77' },
  modalName: { fontSize: 22, fontWeight: 'bold', color: '#3D2C2E', textAlign: 'center', marginTop: 14 },
  modalMeta: { fontSize: 13.5, color: '#8A7373', textAlign: 'center', marginTop: 4 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 22, padding: 18, marginTop: 20, borderWidth: 1, borderColor: '#F3E4E2' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#3D2C2E' },
  bodyText: { fontSize: 13.5, color: '#5A4A4C', marginTop: 6, lineHeight: 19 },
  emptyText: { fontSize: 12.5, color: '#B5A3A3', marginTop: 6, fontStyle: 'italic' },
  tag: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginTop: 8 },
  tagText: { fontSize: 12.5, fontWeight: '600', color: '#3D2C2E' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  galleryImage: { width: (width - 40 - 36 - 16) / 3, height: (width - 40 - 36 - 16) / 3, borderRadius: 12 },
});

export default VisitorsScreen;





