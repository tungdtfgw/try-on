import { HTTP_STATUS } from '../config/constants.js';
import * as categoriesService from '../services/categories_service.js';

/**
 * Controller: Lấy tất cả categories
 * GET /api/categories
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getAllCategories();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Lấy category theo ID
 * GET /api/categories/:id
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoriesService.getCategoryById(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Tạo category mới
 * POST /api/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await categoriesService.createCategory(name, description);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Cập nhật category
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categoriesService.updateCategory(id, name, description);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Xóa category
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await categoriesService.deleteCategory(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Xóa danh mục thành công',
    });
  } catch (error) {
    next(error);
  }
};
