import apiClient from './api.js';

/**
 * Lấy thông tin profile của user hiện tại
 * @returns {Promise<Object>} Profile data
 */
export const getProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data.data;
};

/**
 * Cập nhật thông tin profile
 * @param {Object} profileData - Dữ liệu cập nhật { display_name?, height_cm?, weight_kg? }
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/user/profile', profileData);
  return response.data.data;
};

/**
 * Upload ảnh toàn thân
 * @param {File} file - File ảnh
 * @returns {Promise<string>} URL của ảnh đã upload
 */
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/user/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.body_photo_url;
};
