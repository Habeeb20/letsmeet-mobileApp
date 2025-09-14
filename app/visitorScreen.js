
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../constants/api';
import colors from '../colors';
import LoveLoader from './others/LoveLoader';
import CustomError from './others/customError';
import im from '../assets/images/alady.jpg';

const VisitorsScreen = () => {
  const router = useRouter();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const pastelColors = [
    '#FFF3CD', // Light yellow
    '#D4EDDA', // Light green
    '#F8D7DA', // Light pink
    '#D1ECF1', // Light blue
  ];

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
        console.error('Fetch visitors error:', err);
     
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
          {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error('Failed to log visit:', err);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    logVisit(user._id); // Log visit when viewing user details
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
          <Text style={styles.refreshButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Profile Visitors</Text>
        {visitors.length > 0 ? (
          <FlatList
            data={visitors}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => viewUserDetails(item)}>
                <Image
                  source={item.profilePicture ? { uri: item.profilePicture } : im}
                  style={styles.visitorImage}
                  defaultSource={im}
                />
                <Text style={styles.visitorName}>{`${item.firstName} ${item.lastName}`}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noVisitorsContainer}>
            <Icon name="heart" size={50} color={colors.primary} style={styles.heartIcon} />
            <Text style={styles.noVisitorsText}>No Visitors Yet!</Text>
            <Text style={styles.noVisitorsSubText}>
              Keep exploring to attract more visitors to your profile!
            </Text>
          </View>
        )}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {selectedUser && (
              <>
                <Image
                  source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : im}
                  style={styles.modalProfileImage}
                  defaultSource={im}
                />
                <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                <Text style={styles.modalDetail}>Age: {selectedUser.age || 'N/A'}</Text>
                <Text style={styles.modalDetail}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
                <Text style={styles.modalDetail}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
                <Text style={styles.modalDetail}>State: {selectedUser.state || 'Not specified'}</Text>
                <Text style={styles.modalDetail}>Bio: {selectedUser.bio || 'No bio available'}</Text>
                <Text style={styles.modalDetail}>Education: {selectedUser.education || 'Not specified'}</Text>
                <Text style={styles.sectionTitle}>About Me</Text>
                {selectedUser.aboutMe?.length > 0 ? (
                  <FlatList
                    data={selectedUser.aboutMe}
                    horizontal
                    keyExtractor={(item, index) => `modal-about-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.itemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetail}>No info available</Text>
                )}
                <Text style={styles.sectionTitle}>Interests</Text>
                {selectedUser.interests?.length > 0 ? (
                  <FlatList
                    data={selectedUser.interests}
                    horizontal
                    keyExtractor={(item, index) => `modal-interest-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.itemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetail}>No interests available</Text>
                )}
                <Text style={styles.sectionTitle}>Languages</Text>
                {selectedUser.languages?.length > 0 ? (
                  <FlatList
                    data={selectedUser.languages}
                    horizontal
                    keyExtractor={(item, index) => `modal-language-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.itemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetail}>No languages available</Text>
                )}
                <Text style={styles.sectionTitle}>Personality</Text>
                {selectedUser.personality?.length > 0 ? (
                  <FlatList
                    data={selectedUser.personality}
                    horizontal
                    keyExtractor={(item, index) => `modal-personality-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.itemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetail}>No personality info available</Text>
                )}
                <Text style={styles.sectionTitle}>Gallery</Text>
                {selectedUser.gallery?.length > 0 ? (
                  selectedUser.gallery.map((url, index) => (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={styles.galleryImage}
                      defaultSource={im}
                    />
                  ))
                ) : (
                  <Text style={styles.modalDetail}>No gallery images</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  visitorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  visitorName: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 5,
  },
  noVisitorsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noVisitorsText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 10,
  },
  noVisitorsSubText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  heartIcon: {
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  refreshButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    textAlign: 'center',
    color: '#FF4D4D',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  modalProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
  },
  footerSpacer: {
    height: 20,
  },
  itemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default VisitorsScreen;
