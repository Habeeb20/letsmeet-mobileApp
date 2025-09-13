import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getLikedUsers } from '../constants/api';
import Footer from './others/Footer';
import colors from '../colors';
import LoveLoader from './others/LoveLoader';

const LikedUsers = () => {
  const router = useRouter();
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
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
        setToken(storedToken);
        const response = await getLikedUsers(storedToken);
        setLikedUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch liked users');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedUsers();
  }, []);

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
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
      <Text style={styles.title}>Likes sent</Text>
      {likedUsers.length > 0 ? (
        <FlatList
          data={likedUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => viewUserDetails(item)}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
                style={styles.userImage}
                defaultSource={require('../assets/images/alady.jpg')}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
                <Text style={styles.userDetail}>
                  {item.state || 'Not specified'} • {item.age || 'N/A'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>You havent sent any likes yet</Text>
          <Text style={styles.noUsersSubText}>Go back to the dashboard to find your matches!</Text>
        </View>
      )}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : require('../assets/images/alady.jpg')}
                    style={styles.modalProfileImage}
                    defaultSource={require('../assets/images/alady.jpg')}
                  />
                  <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalDetail}>Age: {selectedUser.age || 'N/A'}</Text>
                  <Text style={styles.modalDetail}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
                  <Text style={styles.modalDetail}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
                  <Text style={styles.modalDetail}>State: {selectedUser.state || 'Not specified'}</Text>
                  <Text style={styles.modalDetail}>Education: {selectedUser.education || 'Not specified'}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.modalDetail}>{selectedUser.bio || 'No bio available'}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>About Me</Text>
                  {selectedUser.aboutMe?.length > 0 ? (
                    selectedUser.aboutMe.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No info available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  {selectedUser.interests?.length > 0 ? (
                    selectedUser.interests.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No interests available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  {selectedUser.languages?.length > 0 ? (
                    selectedUser.languages.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No languages available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Personality</Text>
                  {selectedUser.personality?.length > 0 ? (
                    selectedUser.personality.map((item, index) => (
                      <Text key={index} style={styles.modalDetail}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.modalDetail}>No personality info available</Text>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Gallery</Text>
                  {selectedUser.gallery?.length > 0 ? (
                    <FlatList
                      data={selectedUser.gallery}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      renderItem={({ item }) => (
                        <Image
                          source={{ uri: item }}
                          style={styles.galleryImage}
                          defaultSource={require('../assets/images/alady.jpg')}
                        />
                      )}
                      contentContainerStyle={styles.galleryList}
                    />
                  ) : (
                    <Text style={styles.modalDetail}>No gallery images</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
      <Footer style={styles.localFooter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7C6C6FF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop:10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noUsersText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  noUsersSubText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalDetail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  galleryList: {
    paddingVertical: 10,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
    color: '#FF4D4D',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
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

export default LikedUsers;