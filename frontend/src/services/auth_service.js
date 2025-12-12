import apiClient from './api.js';

/**
 * Service: Đăng ký tài khoản mới
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Response data
 */
export const register = async (email, password) => {
  const response = await apiClient.post('/api/auth/register', {
    email,
    password,
  });
  return response.data;
};
