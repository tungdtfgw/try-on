import apiClient from './api.js';

/**
 * Service: Lấy tất cả products với pagination và filter
 * @param {Object} params - Query parameters (limit, offset, category_id)
 * @returns {Promise<Object>} Response data chứa danh sách products và pagination
 */
export const getAllProducts = async ({ limit = 10, offset = 0, categoryId = null } = {}) => {
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('offset', offset);
  if (categoryId) {
    params.append('category_id', categoryId);
  }
  
  const response = await apiClient.get(`/products?${params.toString()}`);
  return response.data;
};

/**
 * Service: Lấy product theo ID
 * @param {string} id - ID của product
 * @returns {Promise<Object>} Response data chứa product
 */
export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

/**
 * Service: Tạo product mới
 * @param {Object} productData - Dữ liệu product (name, price, category_id, description)
 * @returns {Promise<Object>} Response data chứa product mới
 */
export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

/**
 * Service: Cập nhật product
 * @param {string} id - ID của product
 * @param {Object} productData - Dữ liệu cập nhật (name, price, category_id, description)
 * @returns {Promise<Object>} Response data chứa product đã cập nhật
 */
export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

/**
 * Service: Xóa product
 * @param {string} id - ID của product
 * @returns {Promise<Object>} Response data
 */
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

/**
 * Service: Upload ảnh sản phẩm
 * @param {string} id - ID của product
 * @param {File} imageFile - File ảnh
 * @returns {Promise<Object>} Response data chứa product đã cập nhật
 */
export const uploadProductImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await apiClient.post(`/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
