import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getLikedBy, acceptLike, rejectLike } from '../constants/api';
import colors from '../colors';
import Footer from './others/Footer';
import LoveLoader from './others/LoveLoader';

const Notifications = () => {
  const router = useRouter();
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pastel colors for horizontal items in modal
  const pastelColors = [
    '#FFF3CD', // Light yellow
    '#D4EDDA', // Light green
    '#F8D7DA', // Light pink
    '#D1ECF1', // Light blue
  ];

  useEffect(() => {
    const fetchLikedBy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          router.push('/signin');
          return;
        }
        setToken(storedToken);
        const response = await getLikedBy(storedToken);
        setLikedByUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch liked by users');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedBy();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await acceptLike(userId, token);
      setLikedByUsers(likedByUsers.filter((user) => user._id !== userId));
    } catch (err) {
      setError('Failed to accept like');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectLike(userId, token);
      setLikedByUsers(likedByUsers.filter((user) => user._id !== userId));
    } catch (err) {
      setError('Failed to reject like');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (isLoading) return <LoveLoader visible={true} />;
  if (error) return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
          <Text style={styles.refreshButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
      <Footer style={styles.localFooter} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Notifications</Text>
        {likedByUsers.length > 0 ? (
          <FlatList
            data={likedByUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.userContainer, { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }]}
                onPress={() => viewUserDetails(item)}
              >
                <Image
                  source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
                  style={styles.userImage}
                  defaultSource={require('../assets/images/alady.jpg')}
                />
                <Text style={styles.userName}>{`${item.firstName} ${item.lastName} liked you!`}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item._id)}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noUsersText}>No new likes</Text>
        )}
        <View style={styles.footerSpacer} />
      </View>
      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedUser && (
              <>
                <Image
                  source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : require('../assets/images/alady.jpg')}
                  style={styles.modalProfileImage}
                  defaultSource={require('../assets/images/alady.jpg')}
                />
                <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                <Text style={styles.modalDetailText}>Age: {selectedUser.age || 'N/A'}</Text>
                <Text style={styles.modalDetailText}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
                <Text style={styles.modalDetailText}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
                <Text style={styles.modalDetailText}>State: {selectedUser.state || 'Not specified'}</Text>
                <Text style={styles.modalDetailText}>Bio: {selectedUser.bio || 'No bio available'}</Text>
                <Text style={styles.modalDetailText}>Education: {selectedUser.education || 'Not specified'}</Text>
                <Text style={styles.modalSectionTitle}>About Me</Text>
                {selectedUser.aboutMe?.length > 0 ? (
                  <FlatList
                    data={selectedUser.aboutMe}
                    horizontal
                    keyExtractor={(item, index) => `modal-about-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>No info available</Text>
                )}
                <Text style={styles.modalSectionTitle}>Interests</Text>
                {selectedUser.interests?.length > 0 ? (
                  <FlatList
                    data={selectedUser.interests}
                    horizontal
                    keyExtractor={(item, index) => `modal-interest-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>No interests available</Text>
                )}
                <Text style={styles.modalSectionTitle}>Languages</Text>
                {selectedUser.languages?.length > 0 ? (
                  <FlatList
                    data={selectedUser.languages}
                    horizontal
                    keyExtractor={(item, index) => `modal-language-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>No languages available</Text>
                )}
                <Text style={styles.modalSectionTitle}>Personality</Text>
                {selectedUser.personality?.length > 0 ? (
                  <FlatList
                    data={selectedUser.personality}
                    horizontal
                    keyExtractor={(item, index) => `modal-personality-${index}`}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.modalItemContainer,
                          { backgroundColor: pastelColors[index % pastelColors.length] },
                        ]}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.modalDetailText}>No personality info available</Text>
                )}
                <Text style={styles.modalSectionTitle}>Gallery</Text>
                {selectedUser.gallery?.length > 0 ? (
                  selectedUser.gallery.map((url, index) => (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={styles.modalGalleryImage}
                      defaultSource={require('../assets/images/alady.jpg')}
                    />
                  ))
                ) : (
                  <Image
                    source={require('../assets/images/alady.jpg')}
                    style={styles.modalGalleryImage}
                    defaultSource={require('../assets/images/alady.jpg')}
                  />
                )}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
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
    backgroundColor: '#D7CA80FF',
    padding: 20,
    marginTop: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFAFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: '500',
  },
  noUsersText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: '#FF4D4D',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  refreshButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
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
  footerSpacer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#E7D7D0FF',
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalDetailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 5,
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalGalleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Notifications;


// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { getLikedBy, acceptLike, rejectLike } from '../constants/api';
// import colors from '../colors';
// import Footer from './others/Footer';
// import LoveLoader from './others/LoveLoader';

// const Notifications = () => {
//   const router = useRouter();
//   const [likedByUsers, setLikedByUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Pastel colors for horizontal items in modal
//   const pastelColors = [
//     '#FFF3CD', // Light yellow
//     '#D4EDDA', // Light green
//     '#F8D7DA', // Light pink
//     '#D1ECF1', // Light blue
//   ];

//   useEffect(() => {
//     const fetchLikedBy = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const storedToken = await AsyncStorage.getItem('authToken');
//         if (!storedToken) {
//           router.push('/signin');
//           return;
//         }
//         setToken(storedToken);
//         const response = await getLikedBy(storedToken);
//         setLikedByUsers(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch liked by users');
//         console.error('Fetch error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchLikedBy();
//   }, []);

//   const handleAccept = async (userId) => {
//     try {
//       await acceptLike(userId, token);
//       setLikedByUsers(likedByUsers.filter((user) => user._id !== userId));
//     } catch (err) {
//       setError('Failed to accept like');
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       await rejectLike(userId, token);
//       setLikedByUsers(likedByUsers.filter((user) => user._id !== userId));
//     } catch (err) {
//       setError('Failed to reject like');
//     }
//   };

//   const viewUserDetails = (user) => {
//     setSelectedUser(user);
//   };

//   const closeModal = () => {
//     setSelectedUser(null);
//   };

//   if (isLoading) return <LoveLoader visible={true} />;
//   if (error) return (
//     <View style={styles.container}>
//       <Text style={styles.error}>{error}</Text>
//       <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
//         <Text style={styles.refreshButtonText}>Retry</Text>
//       </TouchableOpacity>
//       <Footer style={styles.localFooter} />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Notifications</Text>
//       {likedByUsers.length > 0 ? (
//         <FlatList
//           data={likedByUsers}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[styles.userContainer, { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }]}
//               onPress={() => viewUserDetails(item)}
//             >
//               <Image
//                 source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
//                 style={styles.userImage}
//                 defaultSource={require('../assets/images/alady.jpg')}
//               />
//               <Text style={styles.userName}>{`${item.firstName} ${item.lastName} liked you!`}</Text>
//               <View style={styles.actionButtons}>
//                 <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item._id)}>
//                   <Text style={styles.buttonText}>Accept</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
//                   <Text style={styles.buttonText}>Reject</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       ) : (
//         <Text style={styles.noUsersText}>No new likes</Text>
//       )}
//       {/* User Details Modal */}
//       <Modal
//         visible={!!selectedUser}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             {selectedUser && (
//               <>
//                 <Image
//                   source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : require('../assets/images/alady.jpg')}
//                   style={styles.modalProfileImage}
//                   defaultSource={require('../assets/images/alady.jpg')}
//                 />
//                 <Text style={styles.modalName}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
//                 <Text style={styles.modalDetailText}>Age: {selectedUser.age || 'N/A'}</Text>
//                 <Text style={styles.modalDetailText}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
//                 <Text style={styles.modalDetailText}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
//                 <Text style={styles.modalDetailText}>State: {selectedUser.state || 'Not specified'}</Text>
//                 <Text style={styles.modalDetailText}>Bio: {selectedUser.bio || 'No bio available'}</Text>
//                 <Text style={styles.modalDetailText}>Education: {selectedUser.education || 'Not specified'}</Text>
//                 <Text style={styles.modalSectionTitle}>About Me</Text>
//                 {selectedUser.aboutMe?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.aboutMe}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-about-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>No info available</Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Interests</Text>
//                 {selectedUser.interests?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.interests}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-interest-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>No interests available</Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Languages</Text>
//                 {selectedUser.languages?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.languages}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-language-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>No languages available</Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Personality</Text>
//                 {selectedUser.personality?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.personality}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-personality-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.modalItemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.modalItemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={styles.modalDetailText}>No personality info available</Text>
//                 )}
//                 <Text style={styles.modalSectionTitle}>Gallery</Text>
//                 {selectedUser.gallery?.length > 0 ? (
//                   selectedUser.gallery.map((url, index) => (
//                     <Image
//                       key={index}
//                       source={{ uri: url }}
//                       style={styles.modalGalleryImage}
//                       defaultSource={require('../assets/images/alady.jpg')}
//                     />
//                   ))
//                 ) : (
//                   <Image
//                     source={require('../assets/images/alady.jpg')}
//                     style={styles.modalGalleryImage}
//                     defaultSource={require('../assets/images/alady.jpg')}
//                   />
//                 )}
//                 <TouchableOpacity
//                   style={styles.modalCloseButton}
//                   onPress={closeModal}
//                 >
//                   <Text style={styles.modalButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </ScrollView>
//         </View>
//       </Modal>
//       <Footer style={styles.localFooter} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#D7CA80FF',
//     padding: 20,
//     marginTop: 30,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   userContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFAFF',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 5,
//   },
//   userImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userName: {
//     flex: 1,
//     fontSize: 16,
//     color: colors.textPrimary,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//   },
//   acceptButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   rejectButton: {
//     backgroundColor: '#FF4D4D',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: colors.buttonText,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   noUsersText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   error: {
//     textAlign: 'center',
//     color: '#FF4D4D',
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 20,
//   },
//   refreshButton: {
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   refreshButtonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   localFooter: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#E0E0E0',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     marginTop:80,
//     elevation: 4,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#E7D7D0FF',
//     padding: 20,
//   },
//   modalContent: {
//     alignItems: 'center',
//     paddingBottom: 40,
//   },
//   modalProfileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 3,
//     borderColor: colors.primary,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   modalName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalDetailText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginVertical: 5,
//     textAlign: 'center',
//   },
//   modalSectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginTop: 15,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalItemContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     marginRight: 10,
//     marginVertical: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   modalItemText: {
//     fontSize: 14,
//     color: colors.textPrimary,
//     fontWeight: '500',
//   },
//   modalGalleryImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginVertical: 5,
//     borderWidth: 2,
//     borderColor: colors.primary,
//   },
//   modalCloseButton: {
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 10,
//     alignSelf: 'center',
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   modalButtonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default Notifications;