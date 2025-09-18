// utils/cloudinary.js
import axios from 'axios';
const CLOUDINARY_UPLOAD_PRESET = 'essential';
const CLOUDINARY_API_KEY = '624216876378923';
const CLOUDINARY_CLOUD_NAME = 'dc0poqt9l';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

export const uploadToCloudinary = async (uri, type = 'image') => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: `image/${type === 'video' ? 'mp4' : 'jpeg'}`,
    name: `upload.${type === 'video' ? 'mp4' : 'jpg'}`,
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);

  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};