import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getLikedUsers } from '../constants/api';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';
import im from '../assets/images/alady.jpg';
import SubNav from './others/SubNav';

const DetailSection = ({ title, items, emptyText }) => (
  <View style={styles.modalSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items?.length > 0 ? (
      <View style={styles.chipWrap}>
        {items.map((item, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={styles.modalDetail}>{emptyText}</Text>
    )}
  </View>
);

const LikedUsers = () => {
  const router = useRouter();
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLikedUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          router.push('/signin');
          return;
        }
        const response = await getLikedUsers(storedToken);
        const users = Array.isArray(response.data) ? response.data : response.data.users || [];
        setLikedUsers(users);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch liked users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedUsers();
  }, []);

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
  <Text style={styles.title}>Likes Sent</Text>
  <Text style={styles.subtitle}>{likedUsers.length ? `${likedUsers.length} people you liked` : 'Nobody yet'}</Text>
</View>
<SubNav active="history" />

      {likedUsers.length > 0 ? (
        <FlatList
          data={likedUsers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => setSelectedUser(item)} activeOpacity={0.85}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : im}
                style={styles.userImage}
                defaultSource={im}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.userDetail}>{item.state || 'Not specified'} \u2022 {item.age || 'N/A'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#B5A3A3" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.centerScreen}>
          <Ionicons name="heart-outline" size={48} color="#FF3D77" />
          <Text style={styles.noUsersText}>No likes sent yet</Text>
          <Text style={styles.noUsersSubText}>Go back to the dashboard to find your matches!</Text>
        </View>
      )}

      <Modal visible={!!selectedUser} animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
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
                  {selectedUser.state || 'Not specified'}
                </Text>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.modalDetail}>{selectedUser.bio || 'No bio available'}</Text>
                </View>

                <DetailSection title="About Me" items={selectedUser.aboutMe} emptyText="No info available" />
                <DetailSection title="Interests" items={selectedUser.interests} emptyText="No interests available" />
                <DetailSection title="Languages" items={selectedUser.languages} emptyText="No languages available" />
                <DetailSection title="Personality" items={selectedUser.personality} emptyText="No personality info available" />

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Gallery</Text>
                  {selectedUser.gallery?.length > 0 ? (
                    <FlatList
                      data={selectedUser.gallery}
                      keyExtractor={(item, i) => i.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.galleryImage} defaultSource={im} />
                      )}
                      contentContainerStyle={{ gap: 8, marginTop: 8 }}
                    />
                  ) : (
                    <Text style={styles.modalDetail}>No gallery images</Text>
                  )}
                </View>

                <TouchableOpacity onPress={() => setSelectedUser(null)} style={[styles.buttonShadow, { alignSelf: 'center', marginTop: 10 }]}>
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
  listContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24 },
  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 18, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F3E4E2',
  },
  userImage: { width: 60, height: 60, borderRadius: 30, marginRight: 12, borderWidth: 2, borderColor: '#FF3D77' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15.5, fontWeight: '700', color: '#3D2C2E' },
  userDetail: { fontSize: 12.5, color: '#8A7373', marginTop: 2 },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  noUsersText: { fontSize: 18, fontWeight: 'bold', color: '#3D2C2E', marginTop: 12 },
  noUsersSubText: { fontSize: 13, color: '#8A7373', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  error: { fontSize: 14, color: '#E8877A', fontWeight: '600', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  buttonShadow: {
    borderRadius: 999, shadowColor: '#FF3D77', shadowOpacity: 0.3,
    shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4,
  },
  button: { paddingVertical: 13, paddingHorizontal: 34, borderRadius: 999 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: '#FFF8F5' },
  modalContent: { padding: 20, paddingBottom: 40 },
  modalBackButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#F3E4E2',
  },
  modalProfileImage: { width: 130, height: 130, borderRadius: 65, alignSelf: 'center', borderWidth: 3, borderColor: '#FF3D77' },
  modalName: { fontSize: 22, fontWeight: 'bold', color: '#3D2C2E', textAlign: 'center', marginTop: 14 },
  modalMeta: { fontSize: 13.5, color: '#8A7373', textAlign: 'center', marginTop: 4 },
  modalSection: { width: '100%', backgroundColor: '#fff', borderRadius: 22, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#F3E4E2' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#3D2C2E' },
  modalDetail: { fontSize: 13.5, color: '#5A4A4C', marginTop: 6, lineHeight: 19 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { backgroundColor: '#FFF3D6', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12 },
  chipText: { fontSize: 12.5, fontWeight: '600', color: '#3D2C2E' },
  galleryImage: { width: 110, height: 110, borderRadius: 12 },
});

export default LikedUsers;