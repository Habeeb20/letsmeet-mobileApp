import axios from 'axios';
import Constants from 'expo-constants';


// const API_URL = "https://dating-mobileapp-backend1.onrender.com"

// const API_URL = "http://localhost:5000";
const API_URL = 'http://172.20.10.6:5000';
console.log('api.js: API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response || error.message);
    if (error.message.includes('Network Error')) {
      console.error('API Network Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        message: error.response?.data?.message,
      });
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
  api.post('/api/auth/profile', { email, firstName, lastName, profilePicture, dateOfBirth, dateOfBirth});

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
  return response.data;
};




///update profile
export const fetchProfile = async (token) => {
  return api.get('/api/auth/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = async (updateData, token) => {
  return api.put('/api/auth/profile', updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  return api.post(`/api/dating/${userId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Pass a user
export const passUser = async (userId, token) => {
  return api.post(`/api/dating/${userId}/pass`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Accept a like
export const acceptLike = async (userId, token) => {
  return api.post(`/api/dating/${userId}/accept`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Reject a like
export const rejectLike = async (userId, token) => {
  return api.post(`/api/dating/${userId}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get liked users
export const getLikedUsers = async (token) => {
  return api.get('/api/dating/liked', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get users who liked the logged-in user
export const getLikedBy = async (token) => {
  return api.get('/api/dating/liked-by', {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// Get friends
export const getFriends = async (token) => {
  return api.get('/api/dating/friends', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get chat history
export const getChatHistory = async (friendId, token) => {
  return api.get(`/api/dating/${friendId}/chat`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Send a message
export const sendMessage = async (friendId, message, token) => {
  return api.post(`/api/dating/${friendId}/chat`, { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Get user ID by email
export const getUserByEmail = async (email, token) => {
  return api.get(`/api/dating/user-by-email?email=${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export default api;