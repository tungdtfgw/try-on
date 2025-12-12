import apiClient from './api.js';

/**
 * Service: Đăng ký tài khoản mới
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Response data
 */
export const register = async (email, password) => {
  const response = await apiClient.post('/auth/register', {
    email,
    password,
  });
  return response.data;
};

/**
 * Service: Đăng nhập
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Response data chứa token, user, và profile
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};
