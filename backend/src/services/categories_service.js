import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import * as categoriesRepository from '../repositories/categories_repository.js';

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate category name
 */
const validateCategoryName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new AppError('Tên danh mục là bắt buộc', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 100) {
    throw new AppError('Tên danh mục phải từ 1-100 ký tự', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  return trimmedName;
};

/**
 * Validate category description
 */
const validateCategoryDescription = (description) => {
  if (description === null || description === undefined) {
    return null;
  }

  if (typeof description !== 'string') {
    throw new AppError('Mô tả danh mục phải là chuỗi', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  const trimmedDescription = description.trim();
  if (trimmedDescription.length > 500) {
    throw new AppError('Mô tả danh mục không được vượt quá 500 ký tự', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  return trimmedDescription || null;
};

/**
 * Service: Lấy tất cả categories
 */
export const getAllCategories = async () => {
  try {
    const categories = await categoriesRepository.getAllCategories();
    return categories;
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw new AppError(
      'Không thể lấy danh sách danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

/**
 * Service: Lấy category theo ID
 */
export const getCategoryById = async (id) => {
  if (!id) {
    throw new AppError('ID danh mục là bắt buộc', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  try {
    const category = await categoriesRepository.getCategoryById(id);
    
    if (!category) {
      throw new AppError('Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return category;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error getting category by id:', error);
    throw new AppError(
      'Không thể lấy thông tin danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

/**
 * Service: Tạo category mới
 */
export const createCategory = async (name, description) => {
  const validatedName = validateCategoryName(name);
  const validatedDescription = validateCategoryDescription(description);

  // Generate slug from name
  const slug = generateSlug(validatedName);

  // Check if slug already exists
  try {
    const existingCategory = await categoriesRepository.getCategoryBySlug(slug);
    
    if (existingCategory) {
      throw new AppError(
        'Danh mục với tên tương tự đã tồn tại',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Continue if error is not AppError (e.g., not found is ok)
  }

  // Create category
  try {
    const categoryData = {
      name: validatedName,
      slug,
      description: validatedDescription,
    };

    const newCategory = await categoriesRepository.createCategory(categoryData);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);

    // Handle unique constraint violation
    if (error.code === '23505' || error.message?.includes('unique')) {
      throw new AppError(
        'Danh mục với tên tương tự đã tồn tại',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      );
    }

    throw new AppError(
      'Không thể tạo danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

/**
 * Service: Cập nhật category
 */
export const updateCategory = async (id, name, description) => {
  if (!id) {
    throw new AppError('ID danh mục là bắt buộc', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  const validatedName = validateCategoryName(name);
  const validatedDescription = validateCategoryDescription(description);

  // Check if category exists
  try {
    await categoriesRepository.getCategoryById(id);
  } catch (error) {
    throw new AppError('Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  // Generate new slug from name
  const slug = generateSlug(validatedName);

  // Check if new slug conflicts with another category
  try {
    const existingCategory = await categoriesRepository.getCategoryBySlug(slug);
    
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError(
        'Danh mục với tên tương tự đã tồn tại',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Continue if error is not AppError
  }

  // Update category
  try {
    const categoryData = {
      name: validatedName,
      slug,
      description: validatedDescription,
    };

    const updatedCategory = await categoriesRepository.updateCategory(id, categoryData);
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);

    // Handle unique constraint violation
    if (error.code === '23505' || error.message?.includes('unique')) {
      throw new AppError(
        'Danh mục với tên tương tự đã tồn tại',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT
      );
    }

    throw new AppError(
      'Không thể cập nhật danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

/**
 * Service: Xóa category
 */
export const deleteCategory = async (id) => {
  if (!id) {
    throw new AppError('ID danh mục là bắt buộc', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Check if category exists
  try {
    await categoriesRepository.getCategoryById(id);
  } catch (error) {
    throw new AppError('Không tìm thấy danh mục', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  // Check if category has products
  try {
    const hasProducts = await categoriesRepository.checkCategoryHasProducts(id);
    
    if (hasProducts) {
      throw new AppError(
        'Không thể xóa danh mục đang có sản phẩm',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error checking category products:', error);
    throw new AppError(
      'Không thể kiểm tra sản phẩm của danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }

  // Delete category
  try {
    await categoriesRepository.deleteCategory(id);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);

    // Handle foreign key constraint violation
    if (error.code === '23503') {
      throw new AppError(
        'Không thể xóa danh mục đang có sản phẩm',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    throw new AppError(
      'Không thể xóa danh mục',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};
