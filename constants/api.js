// import axios from 'axios';
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const getToken = async () => {
//   return await AsyncStorage.getItem('authToken');
// };


// // const API_URL = "https://dating-mobileapp-backend1.onrender.com"
// const API_URL= "https://letsmeet-mobile-app.vercel.app/"

// // const API_URL = "http://localhost:5000";
// // const API_URL = "http://192.168.100.13:6000";
// // const API_URL = 'http://172.20.10.6:5000';
// console.log('api.js: API_URL:', API_URL);

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 15000,
// });

// api.interceptors.request.use(
//   (config) => {
//     console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
//     return config;
//   },
//   (error) => {
//     console.error('API Request Error:', error.message);
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Response Error:', error.response || error.message);
//     if (error.message.includes('Network Error')) {
//       console.error('API Network Error Details:', {
//         url: error.config?.url,
//         method: error.config?.method,
//         data: error.config?.data,
//         message: error.response?.data?.message,
//       });
//     }
//     return Promise.reject(error);
//   }
// );

// // Onboarding Step 1: Submit Email
// export const submitEmail = (email) =>
//   api.post('/api/auth/email', { email });

// // Onboarding Step 2: Verify Code
// export const verifyCode = (email, code) =>
//   api.post('/api/auth/verify', { email, code });

// // Onboarding Step 3: Submit Phone Number
// export const submitPhone = (email, phoneNumber) =>
//   api.post('/api/auth/phone', { email, phoneNumber });
// export const submitGender = (email, gender) =>
//   api.post('/api/auth/gender', { email, gender });

// // Onboarding Step 4: Submit Profile
// export const submitProfile = (email, firstName, lastName, profilePicture, dateOfBirth) =>
//   api.post('/api/auth/profile', { email, firstName, lastName, profilePicture, dateOfBirth, dateOfBirth});

// // Onboarding Step 5: Submit Interests
// export const submitInterests = (email, interests) =>
//   api.post('/api/auth/interests', { email, interests });

// // Onboarding Step 6: Submit Contacts
// export const submitContacts = (email, contactsFiltered) =>
//   api.post('/contacts', { email, contactsFiltered });

// // Onboarding Step 7: Toggle Notifications
// export const toggleNotifications = (email, notificationsEnabled) =>
//   api.post('/notifications', { email, notificationsEnabled });

// // Login
// export const submitLogin = async (data) => {
//   const response = await api.post('/api/auth/login', data);
//   return response.data;
// };




// ///update profile
// export const fetchProfile = async (token) => {
//   return api.get('/api/auth/dashboard', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const updateProfile = async (updateData, token) => {
//   return api.put('/api/auth/profile', updateData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };


// export const getAllUsers = async () => {
//   return api.get('/api/dating');
// };


// export const getFilteredUsers = async (email, state = null) => {
//   const params = { email };
//   if (state) {
//     params.state = state;
//   }
//   return api.get('/api/dating/filtered', { params });
// };


// // Like a user
// export const likeUser = async (userId, token) => {
//   return api.post(`/api/dating/${userId}/like`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Pass a user
// export const passUser = async (userId, token) => {
//   return api.post(`/api/dating/${userId}/pass`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Accept a like
// export const acceptLike = async (userId, token) => {
//   return api.post(`/api/dating/${userId}/accept`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Reject a like
// export const rejectLike = async (userId, token) => {
//   return api.post(`/api/dating/${userId}/reject`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Get liked users
// export const getLikedUsers = async (token) => {
//   return api.get('/api/dating/liked', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Get users who liked the logged-in user
// export const getLikedBy = async (token) => {
//   return api.get('/api/dating/liked-by', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };



// // Get friends
// export const getFriends = async (token) => {
//   return api.get('/api/dating/friends', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Get chat history
// export const getChatHistory = async (friendId, token) => {
//   return api.get(`/api/dating/${friendId}/chat`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Send a message
// export const sendMessage = async (friendId, message, token) => {
//   return api.post(`/api/dating/${friendId}/chat`, { message }, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };


// // Get user ID by email
// export const getUserByEmail = async (email, token) => {
//   return api.get(`/api/dating/user-by-email?email=${encodeURIComponent(email)}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };


// ///get the user that visit the user profile

// export const visitors = async(token) => {
//    return api.get('/api/dating/visitors', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }



// // Add user to favorites
// export const addFavorite = async (userId, token) => {
//   return api.post('/api/dating/favorite', { userId }, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Get favorited users
// export const getFavorites = async (token) => {
//   return api.get('/api/dating/favorites', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };





// // Post APIs
// export const createPost = async (postData) => {
//   const token = await getToken();
//   return api.post('/api/posts/', postData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const editPost = async (postId, postData) => {
//   const token = await getToken();
//   return api.put(`/api/posts/${postId}`, postData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const deletePost = async (postId) => {
//   const token = await getToken();
//   return api.delete(`/api/posts/${postId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const likePost = async (postId) => {
//   const token = await getToken();
//   return api.post(`/api/posts/${postId}/like`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const commentOnPost = async (postId, content) => {
//   const token = await getToken();
//   return api.post(`/api/posts/${postId}/comment`, { content }, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const sharePost = async (postId) => {
//   const token = await getToken();
//   return api.post(`/api/posts/${postId}/share`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const savePost = async (postId) => {
//   const token = await getToken();
//   return api.post(`/api/posts/${postId}/save`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const trackPostView = async (postId) => {
//   const token = await getToken();
//   return api.post(`/api/posts/${postId}/view`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const getFeed = async () => {
//   const token = await getToken();
//   return api.get('/api/posts/feed', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const getPost = async (postId) => {
//   const token = await getToken();
//   return api.get(`/api/posts/${postId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // Follow APIs
// export const followUser = async (userId) => {
//   const token = await getToken();
//   return api.post(`/api/posts/follow/${userId}`, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const unfollowUser = async (userId) => {
//   const token = await getToken();
//   return api.delete(`/api/posts/follow/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// // User APIs (assuming backend routes exist or add them: GET /api/users/:id, GET /api/users/:id/followers)
// export const getUser = async (userId) => {
//   const token = await getToken();
//   return api.get(`/api/auth/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const getFollowers = async (userId) => {
//   const token = await getToken();
//   return api.get(`/api/auth/${userId}/followers`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };









// export default api;





import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = "https://dating-mobileapp-backend1.onrender.com"
const API_URL = "https://letsmeet-mobile-app.vercel.app/"

// const API_URL = "http://localhost:5000";
// const API_URL = "http://192.168.100.13:6000";
// const API_URL = 'http://172.20.10.6:5000';
console.log('api.js: API_URL:', API_URL);

const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const setToken = async (token) => {
  await AsyncStorage.setItem('authToken', token);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem('authToken');
};

// ---------------------------------------------------------------------------
// Unauthorized handler — lets the app (e.g. root layout) register what should
// happen when a token turns out to be expired/invalid, without api.js needing
// to import navigation directly (avoids circular imports).
// ---------------------------------------------------------------------------
let onUnauthorized = null;
export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ---------------------------------------------------------------------------
// Request interceptor
// Automatically attaches the stored token to every request unless the caller
// already set an explicit Authorization header (keeps old call sites that
// pass `token` manually working without conflict).
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    if (!config.headers?.Authorization) {
      const token = await getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error.message);
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Response interceptor
// On 401 (expired/invalid token): clear the stored token and notify the app
// so it can redirect to sign-in. All other errors pass through unchanged.
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Response Error:', error.response || error.message);

    if (error.message?.includes('Network Error')) {
      console.error('API Network Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        message: error.response?.data?.message,
      });
    }

    if (error.response?.status === 401) {
      await clearToken();
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);

// Onboarding Step 1: Submit Email
export const submitEmail = (email) =>
  api.post('/api/auth/email', { email });

// Onboarding Step 2: Verify Code
export const verifyCode = (email, code) =>
  api.post('/api/auth/verify', { email, code });

// Onboarding Step 3: Submit Phone Number
export const submitPhone = (email, phoneNumber) =>
  api.post('/api/auth/phone', { email, phoneNumber });
export const submitGender = (email, gender) =>
  api.post('/api/auth/gender', { email, gender });

// Onboarding Step 4: Submit Profile
export const submitProfile = (email, firstName, lastName, profilePicture, dateOfBirth) =>
  api.post('/api/auth/profile', { email, firstName, lastName, profilePicture, dateOfBirth });

// Onboarding Step 5: Submit Interests
export const submitInterests = (email, interests) =>
  api.post('/api/auth/interests', { email, interests });

// Onboarding Step 6: Submit Contacts
export const submitContacts = (email, contactsFiltered) =>
  api.post('/contacts', { email, contactsFiltered });

// Onboarding Step 7: Toggle Notifications
export const toggleNotifications = (email, notificationsEnabled) =>
  api.post('/notifications', { email, notificationsEnabled });

// Login
export const submitLogin = async (data) => {
  const response = await api.post('/api/auth/login', data);
  // Save the token immediately on login so the request interceptor can pick it up
  if (response.data?.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

// Logout — clears the stored token
export const logout = async () => {
  await clearToken();
};

/// update profile
export const fetchProfile = async (token) => {
  return api.get('/api/auth/dashboard', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

export const updateProfile = async (updateData, token) => {
  return api.put('/api/auth/profile', updateData, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

export const getAllUsers = async () => {
  return api.get('/api/dating');
};

export const getFilteredUsers = async (email, state = null) => {
  const params = { email };
  if (state) {
    params.state = state;
  }
  return api.get('/api/dating/filtered', { params });
};

// Like a user
export const likeUser = async (userId, token) => {
  return api.post(`/api/dating/${userId}/like`, {}, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Pass a user
export const passUser = async (userId, token) => {
  return api.post(`/api/dating/${userId}/pass`, {}, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Accept a like
export const acceptLike = async (userId, token) => {
  return api.post(`/api/dating/${userId}/accept`, {}, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Reject a like
export const rejectLike = async (userId, token) => {
  return api.post(`/api/dating/${userId}/reject`, {}, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get liked users
export const getLikedUsers = async (token) => {
  return api.get('/api/dating/liked', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get users who liked the logged-in user
export const getLikedBy = async (token) => {
  return api.get('/api/dating/liked-by', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get friends
export const getFriends = async (token) => {
  return api.get('/api/dating/friends', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get chat history
export const getChatHistory = async (friendId, token) => {
  return api.get(`/api/dating/${friendId}/chat`, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Send a message
export const sendMessage = async (friendId, message, token) => {
  return api.post(`/api/dating/${friendId}/chat`, { message }, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get user ID by email
export const getUserByEmail = async (email, token) => {
  return api.get(`/api/dating/user-by-email?email=${encodeURIComponent(email)}`, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

/// get the users that visited the user's profile
export const visitors = async (token) => {
  return api.get('/api/dating/visitors', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Add user to favorites
export const addFavorite = async (userId, token) => {
  return api.post('/api/dating/favorite', { userId }, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Get favorited users
export const getFavorites = async (token) => {
  return api.get('/api/dating/favorites', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : {});
};

// Post APIs
export const createPost = async (postData) => {
  return api.post('/api/posts/', postData);
};

export const editPost = async (postId, postData) => {
  return api.put(`/api/posts/${postId}`, postData);
};

export const deletePost = async (postId) => {
  return api.delete(`/api/posts/${postId}`);
};

export const likePost = async (postId) => {
  return api.post(`/api/posts/${postId}/like`, {});
};

export const commentOnPost = async (postId, content) => {
  return api.post(`/api/posts/${postId}/comment`, { content });
};

export const sharePost = async (postId) => {
  return api.post(`/api/posts/${postId}/share`, {});
};

export const savePost = async (postId) => {
  return api.post(`/api/posts/${postId}/save`, {});
};

export const trackPostView = async (postId) => {
  return api.post(`/api/posts/${postId}/view`, {});
};

export const getFeed = async () => {
  return api.get('/api/posts/feed');
};

export const getPost = async (postId) => {
  return api.get(`/api/posts/${postId}`);
};

// Follow APIs
export const followUser = async (userId) => {
  return api.post(`/api/posts/follow/${userId}`, {});
};

export const unfollowUser = async (userId) => {
  return api.delete(`/api/posts/follow/${userId}`);
};

// User APIs
export const getUser = async (userId) => {
  return api.get(`/api/auth/${userId}`);
};

export const getFollowers = async (userId) => {
  return api.get(`/api/auth/${userId}/followers`);
};

export default api;