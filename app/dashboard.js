






// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ImageBackground,
//   FlatList,
//   Modal,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { getFilteredUsers, likeUser, getLikedUsers } from '../constants/api';
// import Footer from './others/Footer';
// import colors from '../colors';
// import api from '../constants/api';
// import LoveLoader from './others/LoveLoader';
// import im from "../assets/images/alady.jpg"
// import CustomError from './others/customError';
// const { width, height } = Dimensions.get('window');

// const Dashboard = () => {
//   const { email } = useLocalSearchParams();
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [likedUsers, setLikedUsers] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);


//     const pastelColors = [
//     '#FFF3CD', // Light yellow
//     '#D4EDDA', // Light green
//     '#F8D7DA', // Light pink
//     '#D1ECF1', // Light blue
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const storedEmail = await AsyncStorage.getItem('userEmail') || email;
//         const storedToken = await AsyncStorage.getItem('authToken');
//         if (!storedEmail || !storedToken) {
//           router.push('/signin');
//           return;
//         }
//         setToken(storedToken);
//         // Fetch filtered users
//         const response = await getFilteredUsers(storedEmail);
//         setUsers(response.data.data);
//         // Fetch liked users
//         const likedResponse = await getLikedUsers(storedToken);
//         setLikedUsers(likedResponse.data);
//       } catch (err) {
//         router.push('/signin');
//         setError(err.response?.data?.message || 'Failed to fetch data');
//         console.error('Fetch error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [email]);

//   const handleCancel = () => {
//     if (currentIndex < users.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(0);
//     }
//     logVisit(users[currentIndex]?._id);
//   };

//   const handleLike = async () => {
//     const userId = users[currentIndex]?._id;
//     if (userId && token) {
//       try {
//         await likeUser(userId, token);
//         // Update liked users list
//         setLikedUsers([...likedUsers, users[currentIndex]]);
//         if (currentIndex < users.length - 1) {
//           setCurrentIndex(currentIndex + 1);
//         } else {
//           setCurrentIndex(0);
//         }
//         logVisit(userId);
//       } catch (err) {
//         setError('Failed to like user');
//         console.error('Like error:', err);
//       }
//     }
//   };

//   const logVisit = async (userId) => {
//     try {
//       const storedEmail = await AsyncStorage.getItem('userEmail') || email;
//       if (storedEmail && userId && token) {
//         await api.post(
//           `/api/dating/${userId}/visit`,
//           { email: storedEmail },
//           {
//             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//           }
//         );
//       }
//     } catch (err) {
//       console.error('Failed to log visit:', err);
//     }
//   };

//   const viewUserDetails = (user) => {
//     setSelectedUser(user);
//   };

//   const closeModal = () => {
//     setSelectedUser(null);
//   };
//     if (error) return <CustomError message={error} onRetry={() => setIsLoading(true)} />;
  

//   if (isLoading) return <LoveLoader visible={true} />;
//   if (error) return (
//     <View style={styles.noUsersContainer}>
//     <View style={styles.content}>
//      <Text style={styles.error}>{error}</Text>
//       <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
//         <Text style={styles.refreshButtonText}>Retry</Text>
//       </TouchableOpacity>

//     </View>
     
//       <Footer style={styles.localFooter} />
//     </View>
//   );
//   if (!users.length) {
//     return (
//       <View style={styles.noUsersContainer}>
//       <View style={styles.contentContainer}>
//        <Icon name='heart' size={50} color={colors.primary} style={styles.heartIcon} />
//         <Text style={styles.noUsersText}>No Matches Yet!</Text>
//         <Text style={styles.noUsersSubText}>
//           Swipe right to like or left to pass. Find your perfect match!
//         </Text>
//         <Icon name='heart' size={40} color={colors.primary} style={[styles.heartIcon, { marginTop: 20 }]} />
//         <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>

//       </View>
       
//         <Footer style={styles.localFooter} />
//       </View>
//     );
//   }

//   const currentUser = users[currentIndex];
//   // const backgroundImage =  im;
//   const backgroundImage = currentUser?.profilePicture
//     ? { uri: currentUser.profilePicture }
//     : im;

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <ImageBackground
//           source={backgroundImage}
//           style={styles.backgroundImage}
//           resizeMode="cover"
//           defaultSource={im}
//         >
//           <View style={styles.overlay}>
//             <Image
//               source={backgroundImage}
//               style={styles.profileImage}
//               defaultSource={im}
//             />
//             <View style={styles.header}>
//               <Text style={styles.name}>{`${currentUser.firstName} ${currentUser.lastName}`}</Text>
//               <Text style={styles.age}>{currentUser.age || 'N/A'}</Text>
//             </View>
//             <View style={styles.details}>
//               <Text style={styles.detailText}>
//                 Ethnicity: {currentUser.ethnicity?.[0] || 'Not specified'}
//               </Text>
//               <Text style={styles.detailText}>
//                 Faith: {currentUser.myFaith?.[0] || 'Not specified'}
//               </Text>
//               <Text style={styles.detailText}>
//                 State: {currentUser.state || 'Not specified'}
//               </Text>
//             </View>
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={handleCancel}
//                 accessibilityLabel="Pass on user"
//               >
//                 <Icon name='times' size={30} color='#FF4D4D' />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.likeButton}
//                 onPress={handleLike}
//                 accessibilityLabel="Like user"
//               >
//                 <Icon name='star' size={30} color='#FFD700' />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ImageBackground>
      
//                <View style={styles.additionalDetails}>
//           <Text style={styles.sectionTitle}>About Me</Text>
//           {currentUser.aboutMe?.length > 0 ? (
//             <FlatList
//               data={currentUser.aboutMe}
//               horizontal
//               keyExtractor={(item, index) => `about-${index}`}
//               renderItem={({ item, index }) => (
//                 <View
//                   style={[
//                     styles.itemContainer,
//                     { backgroundColor: pastelColors[index % pastelColors.length] },
//                   ]}
//                 >
//                   <Text style={styles.itemText}>{item}</Text>
//                 </View>
//               )}
//               showsHorizontalScrollIndicator={false}
//             />
//           ) : (
//             <Text style={styles.detailText}>No info available</Text>
//           )}
//           <Text style={styles.sectionTitle}>Interests</Text>
//           {currentUser.interests?.length > 0 ? (
//             <FlatList
//               data={currentUser.interests}
//               horizontal
//               keyExtractor={(item, index) => `interest-${index}`}
//               renderItem={({ item, index }) => (
//                 <View
//                   style={[
//                     styles.itemContainer,
//                     { backgroundColor: pastelColors[index % pastelColors.length] },
//                   ]}
//                 >
//                   <Text style={styles.itemText}>{item}</Text>
//                 </View>
//               )}
//               showsHorizontalScrollIndicator={false}
//             />
//           ) : (
//             <Text style={styles.detailText}>No interests available</Text>
//           )}
//           <Text style={styles.sectionTitle}>Languages</Text>
//           {currentUser.languages?.length > 0 ? (
//             <FlatList
//               data={currentUser.languages}
//               horizontal
//               keyExtractor={(item, index) => `language-${index}`}
//               renderItem={({ item, index }) => (
//                 <View
//                   style={[
//                     styles.itemContainer,
//                     { backgroundColor: pastelColors[index % pastelColors.length] },
//                   ]}
//                 >
//                   <Text style={styles.itemText}>{item}</Text>
//                 </View>
//               )}
//               showsHorizontalScrollIndicator={false}
//             />
//           ) : (
//             <Text style={styles.detailText}>No languages available</Text>
//           )}
//           <Text style={styles.sectionTitle}>Personality</Text>
//           {currentUser.personality?.length > 0 ? (
//             <FlatList
//               data={currentUser.personality}
//               horizontal
//               keyExtractor={(item, index) => `personality-${index}`}
//               renderItem={({ item, index }) => (
//                 <View
//                   style={[
//                     styles.itemContainer,
//                     { backgroundColor: pastelColors[index % pastelColors.length] },
//                   ]}
//                 >
//                   <Text style={styles.itemText}>{item}</Text>
//                 </View>
//               )}
//               showsHorizontalScrollIndicator={false}
//             />
//           ) : (
//             <Text style={styles.detailText}>No personality info available</Text>
//           )}
//           <Text style={styles.sectionTitle}>Bio</Text>
//           <Text style={styles.detailText}>{currentUser.bio || 'No bio available'}</Text>
//           <Text style={styles.sectionTitle}>Education</Text>
//           <Text style={styles.detailText}>{currentUser.education || 'Not specified'}</Text>
//           <Text style={styles.sectionTitle}>Gallery</Text>
//           {currentUser.gallery?.length > 0 ? (
//             currentUser.gallery.map((url, index) => (
//               <Image
//                 key={index}
//                 source={{ uri: url }}
//                 style={styles.galleryImage}
//                 defaultSource={im}
//               />
//             ))
//           ) : (
//             <Image
//               source={im}
//               style={styles.galleryImage}
//               defaultSource={im}
//             />
//           )}
//         </View>
//         {/* Liked Users Section */}
//         <View style={styles.additionalDetails}>
//           <Text style={styles.sectionTitle}>Users You Liked</Text>
//           {likedUsers.length > 0 ? (
//             <FlatList
//               data={likedUsers}
//               horizontal
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => viewUserDetails(item)}>
//                   <Image
//                     source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
//                     style={{
//                       width: 80,
//                       height: 80,
//                       borderRadius: 40,
//                       marginHorizontal: 10,
//                       borderWidth: 2,
//                       borderColor: colors.primary,
//                     }}
//                     defaultSource={im}
//                   />
//                   <Text style={{
//                     fontSize: 14,
//                     color: colors.textPrimary,
//                     textAlign: 'center',
//                     marginTop: 5,
//                   }}>{`${item.firstName} ${item.lastName}`}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           ) : (
//             <Text style={styles.detailText}>No users liked yet</Text>
//           )}
//         </View>
//         <View style={styles.footerSpacer} />
//       </ScrollView>
//       {/* User Details Modal */}
//       <Modal
//         visible={!!selectedUser}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={{
//           flex: 1,
//           backgroundColor: '#F5F5F5',
//           padding: 20,
//         }}>
//           <ScrollView>
//             {selectedUser && (
//               <>
//                 <Image
//                   source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : require('../assets/images/alady.jpg')}
//                   style={{
//                     width: 150,
//                     height: 150,
//                     borderRadius: 75,
//                     alignSelf: 'center',
//                     marginBottom: 20,
//                     borderWidth: 3,
//                     borderColor: colors.primary,
//                   }}
//                   defaultSource={im}
//                 />
//                 <Text style={{
//                   fontSize: 24,
//                   fontWeight: '700',
//                   color: colors.textPrimary,
//                   textAlign: 'center',
//                   marginBottom: 10,
//                 }}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>Age: {selectedUser.age || 'N/A'}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>State: {selectedUser.state || 'Not specified'}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>Bio: {selectedUser.bio || 'No bio available'}</Text>
//                 <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>Education: {selectedUser.education || 'Not specified'}</Text>
//                 <Text style={styles.sectionTitle}>About Me</Text>
//                 {selectedUser.aboutMe?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.aboutMe}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-about-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.itemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.itemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={{
//                     fontSize: 16,
//                     color: colors.textSecondary,
//                     marginVertical: 5,
//                     textAlign: 'center',
//                   }}>No info available</Text>
//                 )}
//                       {selectedUser.interests?.length > 0 ? (
//                   <FlatList
//                     data={selectedUser.interests}
//                     horizontal
//                     keyExtractor={(item, index) => `modal-interest-${index}`}
//                     renderItem={({ item, index }) => (
//                       <View
//                         style={[
//                           styles.itemContainer,
//                           { backgroundColor: pastelColors[index % pastelColors.length] },
//                         ]}
//                       >
//                         <Text style={styles.itemText}>{item}</Text>
//                       </View>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 ) : (
//                   <Text style={{
//                     fontSize: 16,
//                     color: colors.textSecondary,
//                     marginVertical: 5,
//                     textAlign: 'center',
//                   }}>No interests available</Text>
//                 )}
//                 <Text style={styles.sectionTitle}>Languages</Text>
//                 {selectedUser.languages?.map((item, index) => (
//                   <Text key={index} style={{
//                     fontSize: 16,
//                     color: colors.textSecondary,
//                     marginVertical: 5,
//                     textAlign: 'center',
//                   }}>{item}</Text>
//                 )) || <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>No languages available</Text>}
//                 <Text style={styles.sectionTitle}>Personality</Text>
//                 {selectedUser.personality?.map((item, index) => (
//                   <Text key={index} style={{
//                     fontSize: 16,
//                     color: colors.textSecondary,
//                     marginVertical: 5,
//                     textAlign: 'center',
//                   }}>{item}</Text>
//                 )) || <Text style={{
//                   fontSize: 16,
//                   color: colors.textSecondary,
//                   marginVertical: 5,
//                   textAlign: 'center',
//                 }}>No personality info available</Text>}
//                 <Text style={styles.sectionTitle}>Gallery</Text>
//                 {selectedUser.gallery?.length > 0 ? (
//                   selectedUser.gallery.map((url, index) => (
//                     <Image
//                       key={index}
//                       source={{ uri: url }}
//                       style={styles.galleryImage}
//                       defaultSource={im}
//                     />
//                   ))
//                 ) : (
//                   <Text style={{
//                     fontSize: 16,
//                     color: colors.textSecondary,
//                     marginVertical: 5,
//                     textAlign: 'center',
//                   }}>No gallery images</Text>
//                 )}
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: colors.primary,
//                     padding: 12,
//                     borderRadius: 10,
//                     alignSelf: 'center',
//                     marginTop: 20,
//                   }}
//                   onPress={closeModal}
//                 >
//                   <Text style={{
//                     color: colors.buttonText,
//                     fontSize: 16,
//                     fontWeight: '500',
//                   }}>Close</Text>
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
//     backgroundColor: '#F5F5F5',
//   },
//     contentContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   content:{
//   flex: 1,
//     justifyContent: 'space-between',
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     alignItems: 'center',
//   },
//   backgroundImage: {
//     width: width,
//     height: height, // Full screen height
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)', // Light overlay for text readability
//   },
//   profileImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     borderWidth: 4,
//     borderColor: colors.primary,
//     marginBottom: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#FFFFFF', // White for contrast
//     marginRight: 10,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   age: {
//     fontSize: 20,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   details: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   detailText: {
//     fontSize: 16,
//     backgroundColor: '#191717FF',
//     padding:5,
//     color:'#fff',
//     marginVertical: 5,
//     textShadowRadius: 2,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   cancelButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent for buttons
//     borderRadius: 50,
//     padding: 15,
//     shadowColor: '#FF4D4D',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   likeButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: 50,
//     padding: 15,
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   additionalDetails: {
//     width: width - 40,
//     backgroundColor: '#FAFAFA',
//     borderRadius: 15,
//     padding: 15,
//     marginTop: 20,
//     marginBottom: 100,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   galleryImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   noUsersContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   noUsersText: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     marginVertical: 10,
//   },
//   noUsersSubText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   heartIcon: {
//     marginVertical: 10,
//   },
//   refreshButton: {
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 10,
//   },
//   refreshButtonText: {
//     color: colors.buttonText,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   error: {
//     textAlign: 'center',
//     color: '#FF4D4D',
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 20,
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
//     elevation: 4,
//     padding: 20,
//   },
//   footerSpacer: {
//     height: 80,
//   },
//   itemContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     marginRight: 10,
//     marginVertical: 5,
//   },
//   itemText: {
//     fontSize: 14,
//     color: colors.textPrimary,
//     fontWeight: '500',
//   },
// });

// export default Dashboard;
















import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFilteredUsers, likeUser, getLikedUsers } from '../constants/api';
import Footer from './others/Footer';
import colors from '../colors';
import api from '../constants/api';
import LoveLoader from './others/LoveLoader';
import im from "../assets/images/alady.jpg"
import CustomError from './others/customError';
const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const { email } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [visitors, setVisitors] = useState([]); // New state for visitors
  const [currentIndex, setCurrentIndex] = useState(0);
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
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail') || email;
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedEmail || !storedToken) {
          router.push('/signin');
          return;
        }
        setToken(storedToken);
        // Fetch filtered users
        const response = await getFilteredUsers(storedEmail);
        setUsers(response.data.data);
        // Fetch liked users
        const likedResponse = await getLikedUsers(storedToken);
        setLikedUsers(likedResponse.data);
        // Fetch visitors
        const visitorsResponse = await api.get('/api/dating/visitors', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setVisitors(visitorsResponse.data); // Assuming the response is an array of visitors
      } catch (err) {
        router.push('/signin');
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const handleCancel = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    logVisit(users[currentIndex]?._id);
  };

  const handleLike = async () => {
    const userId = users[currentIndex]?._id;
    if (userId && token) {
      try {
        await likeUser(userId, token);
        // Update liked users list
        setLikedUsers([...likedUsers, users[currentIndex]]);
        if (currentIndex < users.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
        logVisit(userId);
      } catch (err) {
        setError('Failed to like user');
        console.error('Like error:', err);
      }
    }
  };

  const logVisit = async (userId) => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail') || email;
      if (storedEmail && userId && token) {
        await api.post(
          `/api/dating/visit`,
          { profileId: userId }, // Updated to match backend expectation
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
    <View style={styles.noUsersContainer}>
      <View style={styles.content}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
          <Text style={styles.refreshButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
      <Footer style={styles.localFooter} />
    </View>
  );
  if (!users.length) {
    return (
      <View style={styles.noUsersContainer}>
        <View style={styles.contentContainer}>
          <Icon name='heart' size={50} color={colors.primary} style={styles.heartIcon} />
          <Text style={styles.noUsersText}>No Matches Yet!</Text>
          <Text style={styles.noUsersSubText}>
            Swipe right to like or left to pass. Find your perfect match!
          </Text>
          <Icon name='heart' size={40} color={colors.primary} style={[styles.heartIcon, { marginTop: 20 }]} />
          <TouchableOpacity style={styles.refreshButton} onPress={() => setIsLoading(true)}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <Footer style={styles.localFooter} />
      </View>
    );
  }

  const currentUser = users[currentIndex];
  const backgroundImage = currentUser?.profilePicture
    ? { uri: currentUser.profilePicture }
    : im;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
          defaultSource={im}
        >
          <View style={styles.overlay}>
            <Image
              source={backgroundImage}
              style={styles.profileImage}
              defaultSource={im}
            />
            <View style={styles.header}>
              <Text style={styles.name}>{`${currentUser.firstName} ${currentUser.lastName}`}</Text>
              <Text style={styles.age}>{currentUser.age || 'N/A'}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailText}>
                Ethnicity: {currentUser.ethnicity?.[0] || 'Not specified'}
              </Text>
              <Text style={styles.detailText}>
                Faith: {currentUser.myFaith?.[0] || 'Not specified'}
              </Text>
              <Text style={styles.detailText}>
                State: {currentUser.state || 'Not specified'}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                accessibilityLabel="Pass on user"
              >
                <Icon name='times' size={30} color='#FF4D4D' />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={handleLike}
                accessibilityLabel="Like user"
              >
                <Icon name='star' size={30} color='#FFD700' />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      
        <View style={styles.additionalDetails}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {currentUser.aboutMe?.length > 0 ? (
            <FlatList
              data={currentUser.aboutMe}
              horizontal
              keyExtractor={(item, index) => `about-${index}`}
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
            <Text style={styles.detailText}>No info available</Text>
          )}
          <Text style={styles.sectionTitle}>Interests</Text>
          {currentUser.interests?.length > 0 ? (
            <FlatList
              data={currentUser.interests}
              horizontal
              keyExtractor={(item, index) => `interest-${index}`}
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
            <Text style={styles.detailText}>No interests available</Text>
          )}
          <Text style={styles.sectionTitle}>Languages</Text>
          {currentUser.languages?.length > 0 ? (
            <FlatList
              data={currentUser.languages}
              horizontal
              keyExtractor={(item, index) => `language-${index}`}
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
            <Text style={styles.detailText}>No languages available</Text>
          )}
          <Text style={styles.sectionTitle}>Personality</Text>
          {currentUser.personality?.length > 0 ? (
            <FlatList
              data={currentUser.personality}
              horizontal
              keyExtractor={(item, index) => `personality-${index}`}
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
            <Text style={styles.detailText}>No personality info available</Text>
          )}
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.detailText}>{currentUser.bio || 'No bio available'}</Text>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.detailText}>{currentUser.education || 'Not specified'}</Text>
          <Text style={styles.sectionTitle}>Gallery</Text>
        

 {/* <ScrollView showsVerticalScrollIndicator={false}>
  {currentUser.gallery?.length > 0 ? (
    <View style={styles.galleryContainer}>
      {Array(Math.ceil(currentUser.gallery.length / 3))
        .fill()
        .map((_, rowIndex) => (
          <ScrollView
            key={`row-${rowIndex}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryRow}
          >
            {currentUser.gallery
              .slice(rowIndex * 3, (rowIndex + 1) * 3)
              .map((url, index) => (
                <Image
                  key={`gallery-${rowIndex * 3 + index}`}
                  source={{ uri: url }}
                  style={styles.galleryImage}
                  defaultSource={im}
                />
              ))}
          </ScrollView>
        ))}
    </View>
  ) : (
    <Image source={im} style={styles.galleryImage} defaultSource={im} />
  )}
</ScrollView> */}

<ScrollView showsVerticalScrollIndicator={false}>
  {currentUser.gallery?.length > 0 ? (
    <View style={styles.galleryContainer}>
      {Array(Math.ceil(currentUser.gallery.length / 3))
        .fill()
        .map((_, rowIndex) => (
          <ScrollView
            key={`row-${rowIndex}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryRow}
          >
            {currentUser.gallery
              .slice(rowIndex * 3, (rowIndex + 1) * 3)
              .map((url, index) => (
                <TouchableOpacity
                  key={`gallery-${rowIndex * 3 + index}`}
                  onPress={() => {
                    setSelectedImage(url);
                    setModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: url }}
                    style={styles.galleryImage}
                    defaultSource={im}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        ))}
    </View>
  ) : (
    <Image source={im} style={styles.galleryImage} defaultSource={im} />
  )}
  <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullScreenImage}
          resizeMode="contain"
          defaultSource={im}
        />
      )}
    </View>
  </Modal>
</ScrollView>
        </View>
        {/* Liked Users Section */}
        <View style={styles.additionalDetails}>
          <Text style={styles.sectionTitle}>Users You Liked</Text>
          {likedUsers.length > 0 ? (
            <FlatList
              data={likedUsers}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => viewUserDetails(item)}>
                  <Image
                    source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginHorizontal: 10,
                      borderWidth: 2,
                      borderColor: colors.primary,
                    }}
                    defaultSource={im}
                  />
                  <Text style={{
                    fontSize: 14,
                    color: colors.textPrimary,
                    textAlign: 'center',
                    marginTop: 5,
                  }}>{`${item.firstName} ${item.lastName}`}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.detailText}>No users liked yet</Text>
          )}
        </View>
        {/* Visitors Section */}
        {/* <View style={styles.additionalDetails}>
          <Text style={styles.sectionTitle}>Profile Visitors</Text>
          {visitors.length > 0 ? (
            <FlatList
              data={visitors}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => viewUserDetails(item)}>
                  <Image
                    source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/images/alady.jpg')}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginHorizontal: 10,
                      borderWidth: 2,
                      borderColor: colors.primary,
                    }}
                    defaultSource={im}
                  />
                  <Text style={{
                    fontSize: 14,
                    color: colors.textPrimary,
                    textAlign: 'center',
                    marginTop: 5,
                  }}>{`${item.firstName} ${item.lastName}`}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.detailText}>No visitors yet</Text>
          )}
        </View> */}
        <View style={styles.footerSpacer} />
      </ScrollView>
      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: '#F5F5F5',
          padding: 20,
        }}>
          <ScrollView>
            {selectedUser && (
              <>
                <Image
                  source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture } : require('../assets/images/alady.jpg')}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    alignSelf: 'center',
                    marginBottom: 20,
                    borderWidth: 3,
                    borderColor: colors.primary,
                  }}
                  defaultSource={im}
                />
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.textPrimary,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>Age: {selectedUser.age || 'N/A'}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>Ethnicity: {selectedUser.ethnicity?.[0] || 'Not specified'}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>Faith: {selectedUser.myFaith?.[0] || 'Not specified'}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>State: {selectedUser.state || 'Not specified'}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>Bio: {selectedUser.bio || 'No bio available'}</Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>Education: {selectedUser.education || 'Not specified'}</Text>
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
                  <Text style={{
                    fontSize: 16,
                    color: colors.textSecondary,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}>No info available</Text>
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
                  <Text style={{
                    fontSize: 16,
                    color: colors.textSecondary,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}>No interests available</Text>
                )}
                <Text style={styles.sectionTitle}>Languages</Text>
                {selectedUser.languages?.map((item, index) => (
                  <Text key={index} style={{
                    fontSize: 16,
                    color: colors.textSecondary,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}>{item}</Text>
                )) || <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>No languages available</Text>}
                <Text style={styles.sectionTitle}>Personality</Text>
                {selectedUser.personality?.map((item, index) => (
                  <Text key={index} style={{
                    fontSize: 16,
                    color: colors.textSecondary,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}>{item}</Text>
                )) || <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginVertical: 5,
                  textAlign: 'center',
                }}>No personality info available</Text>}
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
                  <Text style={{
                    fontSize: 16,
                    color: colors.textSecondary,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}>No gallery images</Text>
                )}
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    padding: 12,
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginTop: 20,
                  }}
                  onPress={closeModal}
                >
                  <Text style={{
                    color: colors.buttonText,
                    fontSize: 16,
                    fontWeight: '500',
                  }}>Close</Text>
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
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  backgroundImage: {
    width: width,
    height: height, // Full screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Light overlay for text readability
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.primary,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF', // White for contrast
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  age: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  details: {
    marginBottom: 20,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    backgroundColor: '#C8BABAFF',
    padding: 5,
    color: '#000000',
    marginVertical: 5,
    textShadowRadius: 2,
    borderRadius:15
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent for buttons
    borderRadius: 50,
    padding: 15,
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    padding: 15,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  additionalDetails: {
    width: width - 40,
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5,
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  noUsersText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 10,
  },
  noUsersSubText: {
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
    marginTop: 20,
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
    padding: 20,
  },
  footerSpacer: {
    height: 80,
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
//   galleryImage: {
//   width: 150, // Fixed width for horizontal scrolling
//   height: 150,
//   borderRadius: 12,
//   marginRight: 10, // Space between images
//   marginBottom: 5,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.2,
//   shadowRadius: 4,
//   elevation: 3, 
// },

galleryContainer: {
  paddingHorizontal: 10,
  paddingBottom: 10,
},
galleryRow: {
  flexDirection: 'row',
  marginBottom: 10,
},
galleryImage: {
  width: (Dimensions.get('window').width - 40) / 3, // Divide screen width for 3 images
  height: (Dimensions.get('window').width - 40) / 3, // Square images
  borderRadius: 12,
  marginRight: 10, // Space between images in a row
  marginBottom: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent dark background
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
fullScreenImage: {
  width: Dimensions.get('window').width - 40,
  height: Dimensions.get('window').height - 100, // Account for padding and close button
  borderRadius: 12,
},
closeButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: '#FF4D4D',
  borderRadius: 20,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
closeButtonText: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
},
});

export default Dashboard;



















































































