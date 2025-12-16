import * as productsRepository from '../repositories/products_repository.js';
import * as categoriesRepository from '../repositories/categories_repository.js';

/**
 * Service: Lấy tất cả products với pagination và filter
 */
export const getAllProducts = async ({ limit = 10, offset = 0, categoryId = null }) => {
  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  if (offset < 0) {
    throw new Error('Offset must be non-negative');
  }

  if (categoryId) {
    const category = await categoriesRepository.getCategoryById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  const result = await productsRepository.getAllProducts({ limit, offset, categoryId });
  
  return {
    products: result.data,
    pagination: {
      total: result.count,
      limit,
      offset,
      hasMore: offset + limit < result.count
    }
  };
};

/**
 * Service: Lấy product theo ID
 */
export const getProductById = async (id) => {
  const product = await productsRepository.getProductById(id);
  
  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Service: Tạo product mới
 */
export const createProduct = async (productData) => {
  const { name, price, category_id, description } = productData;

  if (!name || name.trim().length === 0) {
    throw new Error('Product name is required');
  }

  if (name.length > 200) {
    throw new Error('Product name must not exceed 200 characters');
  }

  if (!price || price <= 0) {
    throw new Error('Price must be greater than 0');
  }

  if (!category_id) {
    throw new Error('Category ID is required');
  }

  const category = await categoriesRepository.getCategoryById(category_id);
  if (!category) {
    throw new Error('Category not found');
  }

  if (description && description.length > 1000) {
    throw new Error('Description must not exceed 1000 characters');
  }

  const newProduct = await productsRepository.createProduct({
    name: name.trim(),
    price: parseFloat(price),
    category_id,
    description: description ? description.trim() : null
  });

  return newProduct;
};

/**
 * Service: Cập nhật product
 */
export const updateProduct = async (id, productData) => {
  const existingProduct = await productsRepository.getProductById(id);
  if (!existingProduct) {
    throw new Error('Product not found');
  }

  const { name, price, category_id, description } = productData;

  if (name !== undefined) {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (name.length > 200) {
      throw new Error('Product name must not exceed 200 characters');
    }
  }

  if (price !== undefined) {
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }
  }

  if (category_id !== undefined) {
    const category = await categoriesRepository.getCategoryById(category_id);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  if (description !== undefined && description && description.length > 1000) {
    throw new Error('Description must not exceed 1000 characters');
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (category_id !== undefined) updateData.category_id = category_id;
  if (description !== undefined) updateData.description = description ? description.trim() : null;

  const updatedProduct = await productsRepository.updateProduct(id, updateData);
  return updatedProduct;
};

/**
 * Service: Xóa product
 */
export const deleteProduct = async (id) => {
  const product = await productsRepository.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  if (product.image_url) {
    try {
      await productsRepository.deleteProductImage(id);
    } catch (error) {
      console.error('Error deleting product image:', error);
    }
  }

  await productsRepository.deleteProduct(id);
  return true;
};

/**
 * Service: Upload ảnh sản phẩm
 */
export const uploadProductImage = async (id, file) => {
  const product = await productsRepository.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Only JPEG and PNG images are allowed');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image size must not exceed 5MB');
  }

  if (product.image_url) {
    try {
      await productsRepository.deleteProductImage(id);
    } catch (error) {
      console.error('Error deleting old product image:', error);
    }
  }

  const fileExt = file.mimetype.split('/')[1];
  const imageUrl = await productsRepository.uploadProductImage(id, file.buffer, file.mimetype, fileExt);

  const updatedProduct = await productsRepository.updateProduct(id, { image_url: imageUrl });
  return updatedProduct;
};
