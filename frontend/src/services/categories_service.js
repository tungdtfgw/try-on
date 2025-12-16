import apiClient from './api.js';

/**
 * Service: Lấy tất cả categories
 * @returns {Promise<Object>} Response data chứa danh sách categories
 */
export const getAllCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

/**
 * Service: Lấy category theo ID
 * @param {string} id - ID của category
 * @returns {Promise<Object>} Response data chứa category
 */
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

/**
 * Service: Tạo category mới
 * @param {Object} categoryData - Dữ liệu category (name, description)
 * @returns {Promise<Object>} Response data chứa category mới
 */
export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/categories', categoryData);
  return response.data;
};

/**
 * Service: Cập nhật category
 * @param {string} id - ID của category
 * @param {Object} categoryData - Dữ liệu cập nhật (name, description)
 * @returns {Promise<Object>} Response data chứa category đã cập nhật
 */
export const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Service: Xóa category
 * @param {string} id - ID của category
 * @returns {Promise<Object>} Response data
 */
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};
